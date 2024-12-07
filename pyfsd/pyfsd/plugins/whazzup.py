"""PyFSD PyFSDPlugin plugin :: whazzup.py
Version: 2
"""
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, Optional

from pyfsd.plugin import BasePyFSDPlugin
from twisted.plugin import IPlugin
from zope.interface import implementer

if TYPE_CHECKING:
    from pyfsd.service import PyFSDService


@implementer(IPlugin)
class WhazzupGenerator(BasePyFSDPlugin):
    # Most whazzup ver.3 (vatsim)
    plugin_name = "whazzup"
    pyfsd: Optional["PyFSDService"] = None

    def beforeStart(self, pyfsd: "PyFSDService", _: Optional[dict]) -> None:
        self.pyfsd = pyfsd

    def generateWhazzup(self, heading_instead_pbh: bool = False) -> dict:
        assert self.pyfsd is not None, "PyFSD not started."
        assert self.pyfsd.client_factory is not None, "Client factory not started."
        whazzup: Dict[str, Any] = {"pilot": [], "controllers": []}
        utc_now = datetime.utcnow()
        whazzup["general"] = {
            "version": 3,
            "reload": 1,
            "update": utc_now.strftime("%Y%m%d%H%M%S"),
            "update_timestamp": utc_now.strftime("%Y-%m-%dT%H:%M:%S.%f0Z"),
        }
        for client in self.pyfsd.client_factory.clients.values():
            client_info = {
                "cid": client.cid,
                "name": client.realname,
                "callsign": client.callsign,
                "logon_time": datetime.fromtimestamp(client.start_time).strftime(
                    "%Y-%m-%dT%H:%M:%S.%f0Z"
                ),
                "rating": client.rating,
                "last_updated": client.last_updated,
            }
            if client.position_ok:
                lat, lon = client.position
                client_info["latitude"] = lat
                client_info["longitude"] = lon
                if client.type == "PILOT":
                    client_info["altitude"] = client.altitude
                    if heading_instead_pbh:
                        # https://github.com/xpilot-project/xpilot \
                        # /blob/b7a2375be88e8201c2c3fd8a353ace86f7ef49c3 \
                        # /client/src/fsd/pdu/pdu_base.cpp#L73-L82
                        heading = ((client.pbh >> 2) & 0x3FF) / 1024 * 360
                        if heading < 0:
                            heading += 360
                        elif heading >= 360:
                            heading -= 360
                        client_info["heading"] = round(heading)
                    else:
                        client_info["pbh"] = client.pbh

            if client.type == "PILOT":
                client_info["groundspeed"] = client.ground_speed
                client_info["transponder"] = f"{client.transponder:04d}"
                if client.flight_plan is not None:
                    client_info["flight_plan"] = {
                        "flight_rules": client.flight_plan.type,
                        "aircraft": client.flight_plan.aircraft,
                        "departure": client.flight_plan.dep_airport,
                        "arrival": client.flight_plan.dest_airport,
                        "alternate": client.flight_plan.alt_airport,
                        "cruise_tas": client.flight_plan.tascruise,
                        "altitude": client.flight_plan.alt,
                        "deptime": client.flight_plan.dep_time,
                        "hrs_enroute_time": client.flight_plan.hrs_enroute,
                        "min_enroute_time": client.flight_plan.min_enroute,
                        "hrs_fuel_time": client.flight_plan.hrs_fuel,
                        "min_fuel_time": client.flight_plan.min_fuel,
                        "remarks": client.flight_plan.remarks,
                        "route": client.flight_plan.route,
                        "revision_id": client.flight_plan.revision,
                    }
            else:
                if client.frequency_ok:
                    client_info[
                        "frequency"
                    ] = f"1{client.frequency//1000:02d}.{client.frequency%1000:03d}"
                client_info["facility"] = client.facility_type
                client_info["visual_range"] = client.visual_range

            whazzup["pilot" if client.type == "PILOT" else "controllers"].append(
                client_info
            )
        return whazzup


whazzupGenerator = WhazzupGenerator()
