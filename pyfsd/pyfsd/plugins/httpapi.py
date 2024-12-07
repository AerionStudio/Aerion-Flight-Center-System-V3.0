# mypy: disable-error-code="no-any-return"
"""PyFSD PyFSDPlugin plugin :: httpapi.py
Version: 1
"""

from json import JSONDecodeError, JSONEncoder, dumps, loads
from re import compile
from typing import (
    TYPE_CHECKING,
    Any,
    Callable,
    Dict,
    List,
    Optional,
    Tuple,
    Type,
    Union,
)

from pyfsd.db_tables import users as users_table
from pyfsd.define.config_check import (
    ConfigKeyError,
    MayExist,
    verifyAllConfigStruct,
    verifyConfigStruct,
)
from pyfsd.plugin import IServiceBuilder
from sqlalchemy.sql import exists, select
from twisted.application.internet import TCPServer
from twisted.internet.defer import Deferred
from twisted.logger import Logger
from twisted.plugin import IPlugin
from twisted.python.compat import nativeString
from twisted.web.resource import Resource
from twisted.web.server import NOT_DONE_YET, Site
from zope.interface import implementer

try:
    from pyfsd.plugins.whazzup import whazzupGenerator
except ImportError:
    raise ImportError("httpapi plugin requires whazzup plugin.")

if TYPE_CHECKING:
    from alchimia.engine import TwistedEngine, TwistedResultProxy
    from twisted.python.failure import Failure
    from twisted.web.resource import IResource
    from twisted.web.server import Request

    from ..service import PyFSDService


is_sha256_regex = compile("^[a-fA-F0-9]{64}$")
children: List[
    Tuple[
        bytes,
        Callable[[Type[JSONEncoder], Optional["TwistedEngine"], str], "IResource"],
    ]
] = []


def putChild(
    path: bytes, child: Union[Resource, Type["JSONResource"], Type["DBAPIResource"]]
) -> None:
    if isinstance(child, Resource):
        children.append((path, lambda *_: child))
    elif isinstance(child, type):
        if issubclass(child, DBAPIResource):
            children.append((path, child))
        elif issubclass(child, JSONResource):
            children.append((path, lambda encoder, _, __: child(encoder)))
        else:
            raise TypeError("Invaild child: {child.__name__}")
    else:
        raise TypeError("Invaild child: {child!r}")


def selectAllProxy(
    handler: Callable,
) -> Callable[["TwistedResultProxy"], None]:
    def proxy(proxy: "TwistedResultProxy") -> None:
        proxy.fetchall().addCallback(handler)

    return proxy


def makeEncoder(encoding: str) -> Type[JSONEncoder]:
    class Encoder(JSONEncoder):
        def default(self, o: Any) -> Any:
            if isinstance(o, bytes):
                return o.decode(encoding=encoding, errors="replace")
            else:
                return super().default(o)

    return Encoder


class JSONResource(Resource):
    isLeaf = True
    logger: Logger
    encoder: Type[JSONEncoder]

    def __init__(self, encoder: Type[JSONEncoder]):
        self.encoder = encoder
        self.logger = Logger()
        super().__init__()

    def render(self, request: "Request") -> Union[bytes, int]:
        request.setHeader("Content-Type", "application/json")
        method = getattr(self, "renderJson_" + nativeString(request.method), None)
        if method is None or not hasattr(method, "__call__"):
            request.setResponseCode(501)
            request.setHeader("Content-Type", "application/problem+json")
            return b'{"type": "not-implemented", "title": "Method not Implemented"}'
        try:
            result = method(request)
        except BaseException:
            request.setResponseCode(500)
            request.setHeader("Content-Type", "application/problem+json")
            self.logger.failure("Error info:")
            return (
                b'{"type": "internal-server-error", "title": "Internal Server Error"}'
            )
        if isinstance(result, (dict, list, tuple)):
            return dumps(result, ensure_ascii=False, cls=self.encoder).encode()
        elif isinstance(result, Deferred):

            def errback(failure: "Failure") -> None:
                self.logger.failure(
                    f"Error happend in {'renderJson_' + nativeString(request.method)}",
                    failure=failure,
                )
                if not request.finished:
                    request.setResponseCode(500)
                    request.setHeader("Content-Type", "application/problem+json")
                    request.write(
                        b'{"type": "internal-server-error", '
                        b'"title": "Internal Server Error"}'
                    )
                    request.finish()

            result.addErrback(errback)
            return NOT_DONE_YET
        elif isinstance(result, int):
            return result
        elif isinstance(result, bytes):
            return result
        else:
            self.logger.error("renderer returned invaild data: {data}", data=result)
            request.setResponseCode(500)
            request.setHeader("Content-Type", "application/problem+json")
            return (
                b'{"type": "internal-server-error", "title": "Internal Server Error"}'
            )

    def renderJson_HEAD(self, request: "Request") -> bytes:
        if hasattr(self, "renderJson_GET"):
            write = request.write
            setattr(request, "write", lambda _: None)
            self.renderJson_GET(request)
            setattr(request, "write", write)
            return b""
        else:
            request.setResponseCode(404)
            return b""

    def renderJson_OPTIONS(self, request: "Request") -> bytes:
        request.setResponseCode(204)
        request.responseHeaders.removeHeader("Content-Type")
        available_methods = []
        for name in dir(self):
            if name.startswith("renderJson_"):
                available_methods.append(name[11:])
        request.setHeader("Allow", ", ".join(available_methods))
        return b""

    @staticmethod
    def notFound(request: "Request") -> bytes:
        request.setResponseCode(404)
        request.setHeader("Content-Type", "application/problem+json")
        if not request.method == b"HEAD":
            return b'{"type": "not-found", "title": "Not Found"}'
        return b""

    @staticmethod
    def checkJsonBody(request: "Request", format_: dict) -> Tuple[bool, dict]:
        """Validate json body and give body or error response.

        Args:
            request: The request.
            format_: Format. Like verifyConfigStruct's structure.
        Returns:
            return[1] is body if return[0] == True else return[1] is response
        """
        try:
            body = loads(
                request.content.read().decode(  # type: ignore[union-attr]
                    errors="replace"
                )
            )
        except JSONDecodeError:
            request.setResponseCode(400)
            request.setHeader("Content-Type", "application/problem+json")
            return False, {"type": "invaild-body", "title": "Excepted JSON body"}
        errors = verifyAllConfigStruct(body, format_)
        if errors:
            request.setResponseCode(400)
            request.setHeader("Content-Type", "application/problem+json")
            invalid_params = []
            for error in errors:
                if isinstance(error, ConfigKeyError):
                    invalid_params.append(
                        {"name": error.name, "reason": "Must be exist"}
                    )
                else:
                    invalid_params.append({"name": error.name, "reason": str(error)})
            return False, {
                "type": "invaild-body",
                "title": "Some parameters isn't vaild.",
                "invalid-params": invalid_params,
            }
        return True, body


class DBAPIResource(JSONResource):
    db_engine: Optional["TwistedEngine"]
    token: str

    def __init__(
        self,
        encoder: Type[JSONEncoder],
        db_engine: Optional["TwistedEngine"],
        token: str,
    ) -> None:
        self.db_engine = db_engine
        self.token = token
        super().__init__(encoder)

    @staticmethod
    def dbNotLoaded(request: "Request") -> dict:
        request.setResponseCode(503)
        request.setHeader("Content-Type", "application/problem+json")
        return {
            "type": "service-unavailable",
            "title": "Database engine not loaded.",
        }

    def checkAuth(self, request: "Request") -> Optional[dict]:
        authorization = request.getHeader("Authorization")
        if authorization is None:
            request.setResponseCode(401)
            request.setHeader("Content-Type", "application/problem+json")
            request.setHeader("WWW-Authenticate", 'Bearer realm="token"')
            return {
                "type": "auth-failure",
                "title": "Authorization failure",
                "detail": "Must specify token by 'Authorization: Bearer' header",
            }
        elif not authorization.startswith("Bearer "):
            request.setResponseCode(401)
            request.setHeader("Content-Type", "application/problem+json")
            request.setHeader(
                "WWW-Authenticate",
                'Bearer realm="token", error="invalid_token", '
                'error_description="Only Bearer authorization accepted"',
            )
            return {
                "type": "auth-failure",
                "title": "Authorization failure",
                "detail": "Accept 'Authorization: Bearer' header only",
            }
        elif authorization[7:] != self.token:
            request.setResponseCode(401)
            request.setHeader("Content-Type", "application/problem+json")
            request.setHeader(
                "WWW-Authenticate",
                'Bearer realm="token", error="invalid_token", '
                'error_description="Token incorrect"',
            )
            return {
                "type": "auth-failure",
                "title": "Authorization failure",
                "detail": "Invaild token",
            }
        else:
            return None


class UsersResource(DBAPIResource):
    # Query
    def renderJson_GET(self, request: "Request") -> Union[dict, Deferred, bytes]:
        if request.postpath is None or len(request.postpath) > 1:
            return self.notFound(request)
        elif len(request.postpath) == 1:
            # Query single
            if self.db_engine is None:
                return self.dbNotLoaded(request)

            def singleHandler(result: List[Tuple[int]]) -> None:
                if len(result) == 0:
                    request.write(b'{"exist": false}')
                else:
                    request.write(b'{"exist": true, "rating": %d}' % result[0][0])
                request.finish()

            return self.db_engine.execute(  # type: ignore[no-any-return]
                select([users_table.c.rating]).where(
                    users_table.c.callsign
                    == request.postpath[0].decode(errors="replace")
                )
            ).addCallback(selectAllProxy(singleHandler))
        else:
            # Query all
            if self.db_engine is None:
                return self.dbNotLoaded(request)

            def allHandler(result: List[Tuple[str, int]]) -> None:
                info: Dict[int, List[str]] = {}
                for user in result:
                    callsign, rating = user
                    if rating not in info:
                        info[rating] = []
                    info[rating].append(callsign)
                request.write(
                    dumps(
                        {"rating": info}, ensure_ascii=False, cls=self.encoder
                    ).encode()
                )
                request.finish()

            return self.db_engine.execute(  # type: ignore[no-any-return]
                select([users_table.c.callsign, users_table.c.rating])
            ).addCallback(selectAllProxy(allHandler))

    # Register
    def renderJson_PUT(self, request: "Request") -> Union[dict, Deferred, bytes]:
        if request.postpath is None or len(request.postpath) != 0:
            return self.notFound(request)
        else:
            err = self.checkAuth(request)
            if err is not None:
                return err
            vaild, body = self.checkJsonBody(
                request, {"callsign": str, "password": str}
            )
            if not vaild:
                return body
            if self.db_engine is None:
                return self.dbNotLoaded(request)
            if is_sha256_regex.match(body["password"]) is None:
                request.setResponseCode(400)
                request.setHeader("Content-Type", "application/problem+json")
                return {
                    "type": "invaild-password",
                    "title": "Password must hashed by sha256",
                }

            def sayDone(_: "TwistedResultProxy") -> None:
                request.setResponseCode(204)
                request.finish()

            def checkIfExist(result: List[Tuple[bool]]) -> None:
                if result[0][0]:
                    request.setResponseCode(409)
                    request.setHeader("Content-Type", "application/problem+json")
                    request.write(
                        b'{"type": "callsign-conflict", '
                        b'title": "Callsign already exist"}'
                    )
                    request.finish()
                else:
                    self.db_engine.execute(  # type: ignore[union-attr]
                        users_table.insert().values(
                            callsign=body["callsign"],
                            password=body["password"],
                            rating=1,
                        )
                    ).addCallback(sayDone)

            return self.db_engine.execute(
                exists().where(users_table.c.callsign == body["callsign"]).select()
            ).addCallback(selectAllProxy(checkIfExist))

    # Modify
    def renderJson_PATCH(self, request: "Request") -> Union[dict, Deferred, bytes]:
        if request.postpath is None or len(request.postpath) != 1:
            return self.notFound(request)
        else:
            err = self.checkAuth(request)
            if err is not None:
                return err
            vaild, body = self.checkJsonBody(
                request, {"password": MayExist(str), "rating": MayExist(int)}
            )
            if not vaild:
                return body
            if self.db_engine is None:
                return self.dbNotLoaded(request)
            if is_sha256_regex.match(body["password"]) is None:
                request.setResponseCode(400)
                request.setHeader("Content-Type", "application/problem+json")
                return {
                    "type": "invaild-password",
                    "title": "Password must hashed by sha256",
                }
            password = body.get("password", None)
            rating = body.get("rating", None)
            if password is None and rating is None:
                request.setResponseCode(400)
                request.setHeader("Content-Type", "application/problem+json")
                return {
                    "type": "invaild-body",
                    "title": "Must modify password or rating",
                }
            values = {}
            if password is not None:
                values["password"] = password
            if rating is not None:
                values["rating"] = rating

            def sayDone(_: "TwistedResultProxy") -> None:
                request.setResponseCode(204)
                request.finish()

            def checkIfExist(result: List[Tuple[bool]]) -> None:
                if not result[0][0]:
                    request.setResponseCode(404)
                    request.setHeader("Content-Type", "application/problem+json")
                    request.write(
                        b'{"type": "user-not-found", "title": "User not found"}'
                    )
                    request.finish()
                else:
                    self.db_engine.execute(  # type: ignore[union-attr]
                        users_table.update(
                            users_table.c.callsign
                            == request.postpath[0].decode(  # type: ignore[index]
                                errors="replace"
                            )
                        ).values(**values)
                    ).addCallback(sayDone)

            return self.db_engine.execute(
                exists()
                .where(
                    users_table.c.callsign
                    == request.postpath[0].decode(errors="replace")
                )
                .select()
            ).addCallback(selectAllProxy(checkIfExist))

    # Login
    def renderJson_POST(self, request: "Request") -> Union[dict, Deferred, bytes]:
        if request.postpath is None or len(request.postpath) != 0:
            return self.notFound(request)
        else:
            err = self.checkAuth(request)
            if err is not None:
                return err
            vaild, body = self.checkJsonBody(
                request, {"callsign": str, "password": str}
            )
            if not vaild:
                return body
            if self.db_engine is None:
                return self.dbNotLoaded(request)
            if is_sha256_regex.match(body["password"]) is None:
                request.setResponseCode(400)
                request.setHeader("Content-Type", "application/problem+json")
                return {
                    "type": "invaild-password",
                    "title": "Password must hashed by sha256",
                }

            def handler(result: List[Tuple[str, int]]) -> None:
                if len(result) == 0:
                    request.write(b'{"exist": false}')
                else:
                    hashed_password, rating = result[0]
                    success = (
                        b"true" if hashed_password == body["password"] else b"false"
                    )
                    request.write(
                        b'{"exist": true, "success": %s, "rating": %d}'
                        % (success, rating)
                    )
                request.finish()

            return self.db_engine.execute(
                select([users_table.c.password, users_table.c.rating]).where(
                    users_table.c.callsign == body["callsign"]
                )
            ).addCallback(selectAllProxy(handler))

    # Delete
    def renderJson_DELETE(self, request: "Request") -> Union[dict, Deferred, bytes]:
        if request.postpath is None or len(request.postpath) != 1:
            return self.notFound(request)
        else:
            err = self.checkAuth(request)
            if err is not None:
                return err
            if self.db_engine is None:
                return self.dbNotLoaded(request)

            def sayDone(_: "TwistedResultProxy") -> None:
                request.setResponseCode(204)
                request.finish()

            def checkIfExist(result: List[Tuple[bool]]) -> None:
                if not result[0][0]:
                    request.setResponseCode(404)
                    request.setHeader("Content-Type", "application/problem+json")
                    request.write(
                        b'{"type": "user-not-found", "title": "User not found"}'
                    )
                    request.finish()
                else:
                    self.db_engine.execute(  # type: ignore[union-attr]
                        users_table.delete(
                            users_table.c.callsign
                            == request.postpath[0].decode(  # type: ignore[index]
                                errors="replace"
                            )
                        )
                    ).addCallback(sayDone)

            return self.db_engine.execute(
                exists()
                .where(
                    users_table.c.callsign
                    == request.postpath[0].decode(errors="replace")
                )
                .select()
            ).addCallback(selectAllProxy(checkIfExist))


class WhazzupResource(JSONResource):
    use_heading: bool

    def __init__(self, encoder: Type[JSONEncoder], use_heading: bool):
        super().__init__(encoder)
        self.use_heading = use_heading

    def renderJson_GET(self, request: "Request") -> Union[dict, bytes]:
        if request.postpath is None or len(request.postpath) != 0:
            return self.notFound(request)
        else:
            return whazzupGenerator.generateWhazzup(self.use_heading)


class RootResource(Resource):
    def getChild(self, _: bytes, __: "Request") -> Resource:
        return self

    def render(self, request: "Request") -> bytes:
        return JSONResource.notFound(request)


@implementer(IPlugin, IServiceBuilder)
class ServiceBuilder:
    service_name = "httpapi"

    @staticmethod
    def buildService(pyfsd: "PyFSDService", config: Optional[dict]) -> TCPServer:
        global putChild

        assert config is not None
        verifyConfigStruct(
            config,
            {"port": int, "client_coding": str, "use_heading": bool, "token": str},
        )

        if config["token"] == "DEFAULT":
            from secrets import token_urlsafe

            config["token"] = token_urlsafe()
            Logger().warn(
                "httpai plugin: Please change default token. Now token is {token}",
                token=config["token"],
            )

        encoder = makeEncoder(config["client_coding"])
        root = RootResource()
        root.putChild(
            b"users", UsersResource(encoder, pyfsd.db_engine, config["token"])
        )
        root.putChild(
            b"whazzup.json", WhazzupResource(encoder, config["client_coding"])
        )
        for path, child in children:
            root.putChild(path, child(encoder, pyfsd.db_engine, config["token"]))
            print(path, child)

        def putChild(
            path: bytes,
            child: Union[Resource, Type["JSONResource"], Type["DBAPIResource"]],
        ) -> None:
            if isinstance(child, Resource):
                root.putChild(path, child)
            elif isinstance(child, type):
                if issubclass(child, JSONResource):
                    root.putChild(path, child(encoder))
                elif issubclass(child, DBAPIResource):
                    root.putChild(
                        path, child(encoder, pyfsd.db_engine, config["token"])
                    )
                else:
                    raise TypeError("Invaild child: {child.__name__}")
            else:
                raise TypeError("Invaild child: {child!r}")

        return TCPServer(config["port"], Site(root))


builder = ServiceBuilder()
