import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Pathologie = ({ topPathologies }) => {
  const [data, setData] = useState({
    series: [{ name: "Pathologies", data: [] }],
    options: {
      chart: { type: "bar", height: 400 },
      plotOptions: {
        bar: { horizontal: true, borderRadius: 5, barHeight: "50%" },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}%`,
        style: { fontSize: "12px", colors: ["#304758"] },
      },
      xaxis: { categories: [] },
      yaxis: { labels: { style: { fontSize: "14px" } } },
    },
  });

  useEffect(() => {
    if (topPathologies && topPathologies.length > 0) {
      const categories = topPathologies.map((item) => item.pathology);
      const values = topPathologies.map((item) => parseFloat(item.rate));

      setData((prev) => ({
        ...prev,
        series: [{ name: "Pathologies", data: values }],
        options: { ...prev.options, xaxis: { categories } },
      }));
    }
  }, [topPathologies]);

  return (
    <div className="px-4">
      <h2 className="text-xl font-bold text-gray-700 uppercase">
        Répartition des pathologies en %
      </h2>
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="bar"
        height={310}
      />
    </div>
  );
};

export default Pathologie;
