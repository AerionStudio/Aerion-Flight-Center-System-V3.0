"""PyFSD MetarFetcher plugin :: xmairavt7_metar.py
Version: 3
"""
from html.parser import HTMLParser
from typing import NoReturn, Optional
from urllib.error import ContentTooShortError, HTTPError, URLError
from urllib.request import urlopen

from metar.Metar import Metar
from pyfsd.metar.fetch import IMetarFetcher
from twisted.plugin import IPlugin
from zope.interface import implementer


class MetarPageParser(HTMLParser):
    metar_text: Optional[str] = None

    def handle_data(self, data: str) -> None:
        if self.lasttag == "font":
            if data.startswith("METAR "):
                assert self.metar_text is None
                self.metar_text = data[6:]
            elif data.startswith("SPECI "):
                assert self.metar_text is None
                self.metar_text = data[6:]


@implementer(IPlugin, IMetarFetcher)
class XMAirAVT7MetarFetcher:
    metar_source = "xmairavt7"

    def fetch(self, _: dict, icao: str) -> Optional[Metar]:
        try:
            with urlopen(
                f"http://xmairavt7.xiamenair.com/WarningPage?WarningAirports={icao}"
            ) as html_file:
                parser = MetarPageParser()
                parser.feed(html_file.read().decode())
                if parser.metar_text is None:
                    return None
                else:
                    return Metar(parser.metar_text, strict=False)
        except (ContentTooShortError, HTTPError, URLError):
            return None

    def fetchAll(self, _: dict) -> NoReturn:
        raise NotImplementedError


fetcher = XMAirAVT7MetarFetcher()
