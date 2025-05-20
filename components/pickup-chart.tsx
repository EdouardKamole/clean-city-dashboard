"use client";

import { useEffect, useRef, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import app from "@/firebase";

export function PickupChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState({
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pendingData: [0, 0, 0, 0, 0, 0, 0],
    completedData: [0, 0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    async function fetchChartData() {
      try {
        const db = getFirestore(app);
        const pickupRequestsCollection = collection(db, "pickup_requests");

        const dailyData = {
          pending: [0, 0, 0, 0, 0, 0, 0],
          completed: [0, 0, 0, 0, 0, 0, 0],
        };

        // Get the current date
        const currentDate = new Date();

        // Calculate the date 7 days ago
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);

        // Loop through the last 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date(sevenDaysAgo);
          date.setDate(sevenDaysAgo.getDate() + i);

          // Get the start and end of the day
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          // Create a query to get the pickup requests for the current day
          const q = query(
            pickupRequestsCollection,
            where("timestamp", ">=", startOfDay),
            where("timestamp", "<=", endOfDay)
          );

          const pickupRequestsSnapshot = await getDocs(q);

          pickupRequestsSnapshot.forEach((doc) => {
            const data = doc.data();
            const dayIndex = date.getDay(); // 0 (Sun) to 6 (Sat)
            if (data.status === "pending") {
              dailyData.pending[dayIndex] += 1;
            } else if (data.status === "completed") {
              dailyData.completed[dayIndex] += 1;
            }
          });
        }

        setChartData({
          days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // Correct day order
          pendingData: dailyData.pending,
          completedData: dailyData.completed,
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }

    fetchChartData();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const { days, pendingData, completedData } = chartData;

    // Chart dimensions
    const chartWidth = canvas.width - 60;
    const chartHeight = canvas.height - 60;
    const startX = 40;
    const startY = 20;
    const endY = startY + chartHeight;

    // Draw grid lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    // Horizontal grid lines
    const maxValue = Math.max(...pendingData, ...completedData) + 2;
    const yStep = chartHeight / 5;
    for (let i = 0; i <= 5; i++) {
      const y = endY - i * yStep;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + chartWidth, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = "#6b7280";
      ctx.font = "10px Arial";
      ctx.textAlign = "right";
      ctx.fillText(((i * maxValue) / 5).toFixed(0), startX - 10, y + 3);
    }

    // Draw x-axis labels
    const xStep = chartWidth / (days.length - 1);
    days.forEach((day, i) => {
      const x = startX + i * xStep;
      ctx.fillStyle = "#6b7280";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(day, x, endY + 20);
    });

    // Draw completed data line
    ctx.strokeStyle = "#10b981"; // Green for completed
    ctx.lineWidth = 2;
    ctx.beginPath();
    completedData.forEach((value, i) => {
      const x = startX + i * xStep;
      const y = endY - (value / maxValue) * chartHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw completed data points
    completedData.forEach((value, i) => {
      const x = startX + i * xStep;
      const y = endY - (value / maxValue) * chartHeight;
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw pending data line
    ctx.strokeStyle = "#eab308"; // Yellow for pending
    ctx.lineWidth = 2;
    ctx.beginPath();
    pendingData.forEach((value, i) => {
      const x = startX + i * xStep;
      const y = endY - (value / maxValue) * chartHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw pending data points
    pendingData.forEach((value, i) => {
      const x = startX + i * xStep;
      const y = endY - (value / maxValue) * chartHeight;
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw legend
    const legendX = startX + 10;
    const legendY = startY + 20;

    // Pending legend
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.arc(legendX, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#374151";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Pending", legendX + 10, legendY + 4);

    // Completed legend
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(legendX + 80, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#374151";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Completed", legendX + 90, legendY + 4);
  }, [chartData]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
