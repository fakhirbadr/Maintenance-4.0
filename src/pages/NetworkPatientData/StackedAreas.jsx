import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const parseTimeSlot = (timeSlot) => {
  const match = timeSlot.match(/^(\d{1,2})h$/);
  if (match) {
    const hours = parseInt(match[1], 10);
    const date = new Date(0); // Date fixe (01/01/1970)
    date.setHours(hours);
    return date;
  }
  return null;
};

export default function StackedAreas({ data }) {
  const flattenedData = React.useMemo(() => {
    if (typeof data !== "object" || data === null) return [];

    return Object.entries(data).flatMap(([region, provinces]) =>
      Object.entries(provinces).flatMap(([province, locations]) =>
        Object.entries(locations).flatMap(([location, timeSlots]) =>
          Object.entries(timeSlots)
            .map(([timeSlot, slotData]) => {
              if (!slotData?.patientsWaiting) return null;

              const horaire = parseTimeSlot(timeSlot);
              if (!horaire) return null;

              return {
                region,
                horaire,
                patientsWaiting: Number(slotData.patientsWaiting),
              };
            })
            .filter(Boolean)
        )
      )
    );
  }, [data]);

  const dataset = React.useMemo(() => {
    const groupedData = flattenedData.reduce(
      (acc, { region, horaire, patientsWaiting }) => {
        const key = horaire.getTime();
        if (!acc[key]) {
          acc[key] = { horaire, regions: {} };
        }
        acc[key].regions[region] =
          (acc[key].regions[region] || 0) + patientsWaiting;
        return acc;
      },
      {}
    );

    return Object.values(groupedData)
      .map(({ horaire, regions }) => ({
        horaire,
        ...regions,
      }))
      .sort((a, b) => a.horaire - b.horaire);
  }, [flattenedData]);

  const regions = React.useMemo(
    () => [...new Set(flattenedData.map((item) => item.region))],
    [flattenedData]
  );

  if (!regions.length) {
    return <div>Aucune donnée valide à afficher.</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h3>📊 Patients Waiting par région :</h3>
      <LineChart
        dataset={dataset}
        xAxis={[
          {
            dataKey: "horaire",
            scaleType: "time",
            valueFormatter: (date) =>
              date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
          },
        ]}
        series={regions.map((region) => ({
          dataKey: region,
          label: region,
          area: false, // Pas de remplissage
          showMark: true, // Afficher les points de données
        }))}
        width={850}
        height={400}
        margin={{ left: 70 }}
      />
    </div>
  );
}
