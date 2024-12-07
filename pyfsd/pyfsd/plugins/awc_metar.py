"""PyFSD MetarFetcher plugin :: awc_metar.py
Version: 5
"""
from datetime import datetime
from gzip import open as open_gzip
from typing import Optional
from urllib.error import ContentTooShortError, HTTPError, URLError
from urllib.request import urlopen
from xml.etree.ElementTree import ParseError
from xml.etree.ElementTree import parse as parseXml

from metar.Metar import Metar
from pyfsd.metar.fetch import IMetarFetcher, MetarInfoDict, MetarNotAvailableError
from twisted.plugin import IPlugin
from zope.interface import implementer


@implementer(IPlugin, IMetarFetcher)
class AWCMetarFetcher:
    metar_source = "aviationweather"

    def fetch(self, _: dict, icao: str) -> Optional[Metar]:
        try:
            with urlopen(
                f"https://beta.aviationweather.gov/cgi-bin/data/metar.php?ids={icao}"
            ) as file:
                lines = file.readlines()
                if not lines:
                    return None
                else:
                    return Metar(
                        lines[0].decode("ascii", "ignore").rstrip("\n"), strict=False
                    )
        except (ContentTooShortError, HTTPError, URLError):
            return None

    def fetchAll(self, _: dict) -> MetarInfoDict:
        try:
            result = {}
            with urlopen(
                "https://beta.aviationweather.gov/data/cache/metars.cache.xml.gz"
            ) as gzip_file:
                with open_gzip(gzip_file) as file:
                    try:
                        root = parseXml(file).getroot()
                    except ParseError:
                        raise MetarNotAvailableError
                    data = root.find("data")
                    if data is None:
                        raise MetarNotAvailableError

                    for metar in data:
                        observation_time = metar.findtext("observation_time")
                        station_id = metar.findtext("station_id")
                        raw_text = metar.findtext("raw_text")
                        if (
                            observation_time is None
                            or station_id is None
                            or raw_text is None
                        ):
                            continue
                        try:
                            metar_date = datetime.fromisoformat(
                                observation_time[:-1]
                                if observation_time.startswith("Z")
                                else observation_time
                            )
                            opt = {"month": metar_date.month, "year": metar_date.year}
                        except ValueError:
                            opt = {}

                        result[station_id] = Metar(
                            raw_text,
                            strict=False,
                            **opt,
                        )
            return result
        except (ContentTooShortError, HTTPError, URLError):
            raise MetarNotAvailableError


fetcher = AWCMetarFetcher()
