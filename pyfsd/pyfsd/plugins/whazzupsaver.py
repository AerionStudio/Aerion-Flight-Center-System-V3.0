"""PyFSD PyFSDPlugin plugin :: whazzupsaver.py
Version: 2
"""
from json import JSONEncoder, dump
from typing import Any, Optional

from pyfsd.define.config_check import verifyConfigStruct
from pyfsd.plugin import BasePyFSDPlugin
from twisted.internet.task import LoopingCall
from twisted.plugin import IPlugin
from zope.interface import implementer

try:
    from pyfsd.plugins.whazzup import whazzupGenerator
except ImportError:
    raise ImportError("whazzupsaver plugin requires whazzup plugin.")

DEFAULT_CONFIG = {
    "filename": "whazzup.json",
    "refresh_time": 5,
    "use_heading": True,
    "client_coding": "ascii",
}

__all__ = ["plugin"]


@implementer(IPlugin)
class WhazzupSaverPlugin(BasePyFSDPlugin):
    plugin_name = "whazzupsaver"
    task: Optional[LoopingCall] = None
    config: Optional[dict] = None

    def save(self) -> None:
        assert self.config is not None
        plugin = self

        class Encoder(JSONEncoder):
            def default(self, o: Any) -> Any:
                assert plugin.config is not None
                if isinstance(o, bytes):
                    return o.decode(
                        encoding=plugin.config["client_coding"], errors="replace"
                    )
                else:
                    return super().default(o)

        data = whazzupGenerator.generateWhazzup(
            heading_instead_pbh=self.config["use_heading"]
        )
        with open(self.config["filename"], "w") as file:
            dump(data, file, ensure_ascii=False, cls=Encoder)
            file.truncate()

    def beforeStart(  # type: ignore[no-untyped-def]
        self, _, config: Optional[dict]
    ) -> None:
        if config is None:
            self.config = DEFAULT_CONFIG
        else:
            verifyConfigStruct(
                config,
                {
                    "filename": str,
                    "refresh_time": int,
                    "use_heading": bool,
                    "client_coding": str,
                },
                prefix="plugin.whazzupsaver.",
            )
            self.config = config
        self.task = LoopingCall(self.save)
        self.task.start(self.config["refresh_time"], now=False)


plugin = WhazzupSaverPlugin()
