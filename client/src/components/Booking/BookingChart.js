import React from "react";
import { Bar } from "react-chartjs-2";

function BookingChart({ booking }) {
  const List = {
    cheap: {
      min: 0,
      max: 600,
    },
    normal: {
      min: 600,
      max: 2000,
    },
    expensive: {
      min: 2000,
      max: 10000,
    },
  };

  const chartData = { labels: [], datasets: [] };
  let values = [];

  for (const bucket in List) {
    const Count = booking.reduce((prev, current) => {
      if (
        current.event.price > List[bucket].min &&
        current.event.price < List[bucket].max
      ) {
        return prev + 1;
      }
      return prev;
    }, 0);

    chartData.labels.push(bucket);
    values.push(Count);
    chartData.datasets.push({
      fillColor: "rgba(220, 220,220,0.5)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: [values],
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div>
      <Bar
        data={chartData}
        width={100}
        height={250}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  );
}

export default BookingChart;
