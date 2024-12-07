"""PyFSD PyFSDPlugin plugin :: debug.py
Version: 1
"""
from typing import TYPE_CHECKING, Optional

from twisted.plugin import IPlugin
from zope.interface import implementer

from pyfsd.define.config_check import verifyConfigStruct
from pyfsd.plugin import BasePyFSDPlugin

if TYPE_CHECKING:
    from pyfsd.protocol.client import FSDClientProtocol
    from pyfsd.service import PyFSDService


@implementer(IPlugin)
class DebugPlugin(BasePyFSDPlugin):
    plugin_name = "debug"
    debug = False

    def beforeStart(self, _: "PyFSDService", config: Optional[dict]) -> None:
        assert config is not None
        verifyConfigStruct(config, {"enabled": bool})
        self.debug = config["enabled"]

    def newConnectionEstablished(self, protocol: "FSDClientProtocol") -> None:
        if not self.debug:
            return
        write = getattr(protocol.transport, "write")

        def writer(data: bytes) -> None:
            host: str = getattr(protocol.transport.getPeer(), "host")
            protocol.logger.debug(
                '"{data}" ===> {callsign}',
                data=data.decode("ascii", "backslashreplace"),
                callsign=protocol.client.callsign.decode("ascii", "backslashreplace")
                if protocol.client is not None
                else host,
            )
            write(data)

        setattr(protocol.transport, "write", writer)

    def lineReceivedFromClient(
        self, protocol: "FSDClientProtocol", line: bytes
    ) -> None:
        if not self.debug:
            return
        host: str = getattr(protocol.transport.getPeer(), "host")
        protocol.logger.debug(
            '"{line}" <=== {callsign}',
            line=line.decode("ascii", "backslashreplace"),
            callsign=protocol.client.callsign.decode("ascii", "backslashreplace")
            if protocol.client is not None
            else host,
        )


plugin = DebugPlugin()
