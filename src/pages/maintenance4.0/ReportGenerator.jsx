import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportGenerator = ({ open, onClose }) => {
  const [globalStats, setGlobalStats] = useState(null);
  const [balanceStats, setBalanceStats] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      Promise.all([
        fetch("http://localhost:3000/api/v1/merged-data?isDeleted=false").then((res) => res.json()),
        fetch("http://localhost:3000/api/v1/merged-data?isClosed=false").then((res) => res.json()),
        fetch("/scx.png")
          .then((res) => res.blob())
          .then(
            (blob) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              })
          )
      ])
        .then(([globalData, balanceData, logo]) => {
          console.log("GlobalData structure:", globalData);
          console.log("BalanceData structure:", balanceData);
          setGlobalStats(globalData);
          setBalanceStats(balanceData);
          setLogoBase64(logo);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur :", err);
          setLoading(false);
        });
    }
  }, [open]);

  const mergeEquipmentCategories = (data) => {
    if (!data) return {};
    
    const merged = { ...data };
    
    const equipmentKeys = [
      "équipement généreaux",
      "Équipement Généraux", 
      "Équipements Généraux"
    ];
    
    let mergedEquipment = {};
    
    equipmentKeys.forEach(key => {
      if (merged[key]) {
        Object.keys(merged[key]).forEach(period => {
          mergedEquipment[period] = (mergedEquipment[period] || 0) + merged[key][period];
        });
        delete merged[key];
      }
    });
    
    if (Object.keys(mergedEquipment).length > 0) {
      merged["Équipement Généraux"] = mergedEquipment;
    }
    
    return merged;
  };

  // Fonction pour dessiner un graphique à barres horizontal
  const drawHorizontalBarChart = (pdf, data, startY, title, color) => {
    const chartX = 20;
    const chartY = startY;
    const chartWidth = 170;
    const barHeight = 8;
    const spacing = 3;
    
    // Titre
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 100);
    pdf.text(title, chartX, chartY);
    
    let currentY = chartY + 8;
    
    // Trouver la valeur maximale
    const maxValue = Math.max(...data.map(item => item.value));
    
    data.forEach((item, index) => {
      const barWidth = (item.value / maxValue) * chartWidth;
      
      // Label
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      pdf.text(item.label, chartX, currentY + 5);
      
      // Barre
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.rect(chartX + 50, currentY, barWidth, barHeight, 'F');
      
      // Bordure de la barre
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(chartX + 50, currentY, chartWidth, barHeight, 'S');
      
      // Valeur
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text(item.value.toString(), chartX + 52 + barWidth, currentY + 5);
      
      currentY += barHeight + spacing;
    });
    
    return currentY + 5;
  };

  // Fonction pour dessiner un graphique circulaire (pie chart)
  const drawPieChart = (pdf, data, centerX, centerY, radius, title) => {
    // Titre
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 100);
    pdf.text(title, centerX - 30, centerY - radius - 10);
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Commence en haut
    
    const colors = [
      [63, 81, 181],   // Bleu
      [76, 175, 80],   // Vert
      [255, 152, 0],   // Orange
      [244, 67, 54],   // Rouge
      [156, 39, 176],  // Violet
      [33, 150, 243],  // Bleu clair
      [255, 193, 7]    // Jaune
    ];
    
    // Dessiner les segments
    data.forEach((item, index) => {
      const angle = (item.value / total) * 360;
      const color = colors[index % colors.length];
      
      pdf.setFillColor(color[0], color[1], color[2]);
      
      // Dessiner le segment
      const startAngle = (currentAngle * Math.PI) / 180;
      const endAngle = ((currentAngle + angle) * Math.PI) / 180;
      
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(255, 255, 255);
      
      // Créer le chemin du segment
      const path = [];
      path.push(['m', centerX, centerY]);
      path.push(['l', centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle)]);
      
      for (let a = startAngle; a < endAngle; a += 0.1) {
        path.push(['l', centerX + radius * Math.cos(a), centerY + radius * Math.sin(a)]);
      }
      
      path.push(['l', centerX + radius * Math.cos(endAngle), centerY + radius * Math.sin(endAngle)]);
      path.push(['l', centerX, centerY]);
      
      currentAngle += angle;
    });
    
    // Légende
    let legendY = centerY - radius + 10;
    const legendX = centerX + radius + 15;
    
    data.forEach((item, index) => {
      const color = colors[index % colors.length];
      
      // Carré de couleur
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.rect(legendX, legendY - 3, 4, 4, 'F');
      
      // Texte
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(60, 60, 60);
      const percentage = ((item.value / total) * 100).toFixed(1);
      pdf.text(`${item.label}: ${percentage}%`, legendX + 6, legendY);
      
      legendY += 6;
    });
  };

  // Fonction pour dessiner un graphique linéaire
  const drawLineChart = (pdf, data, startX, startY, width, height, title) => {
    // Titre
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 100);
    pdf.text(title, startX, startY - 5);
    
    // Cadre
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.rect(startX, startY, width, height);
    
    // Grille horizontale
    pdf.setDrawColor(230, 230, 230);
    for (let i = 1; i < 5; i++) {
      const y = startY + (height / 5) * i;
      pdf.line(startX, y, startX + width, y);
    }
    
    // Trouver min et max
    const values = data.map(d => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;
    
    // Dessiner les points et la ligne
    pdf.setDrawColor(63, 81, 181);
    pdf.setLineWidth(1.5);
    
    const points = data.map((item, index) => {
      const x = startX + (width / (data.length - 1)) * index;
      const normalizedValue = (item.value - minValue) / range;
      const y = startY + height - (normalizedValue * height);
      return { x, y, label: item.label, value: item.value };
    });
    
    // Tracer la ligne
    points.forEach((point, index) => {
      if (index > 0) {
        pdf.line(points[index - 1].x, points[index - 1].y, point.x, point.y);
      }
      
      // Point
      pdf.setFillColor(63, 81, 181);
      pdf.circle(point.x, point.y, 1.5, 'F');
    });
    
    // Labels sur l'axe X
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    points.forEach((point) => {
      pdf.text(point.label, point.x - 8, startY + height + 5);
    });
    
    // Valeurs min et max sur l'axe Y
    pdf.text(maxValue.toString(), startX - 8, startY + 3);
    pdf.text(minValue.toString(), startX - 8, startY + height + 3);
  };

  const handleGeneratePdf = () => {
    if (!globalStats || !balanceStats) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    let currentY = 20;

    // Logo centré
    if (logoBase64) {
      const imgProps = pdf.getImageProperties(logoBase64);
      const logoWidth = 40;
      const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
      const logoX = (pageWidth - logoWidth) / 2;
      pdf.addImage(logoBase64, "PNG", logoX, currentY, logoWidth, logoHeight);
      currentY += logoHeight + 10;
    }

    // Titre principal
    pdf.setFont("helvetica", "bolditalic");
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 100);
    pdf.text("Rapport des Statistiques Globales", pageWidth / 2, currentY, {
      align: "center"
    });
    currentY += 8;

    // Date
    pdf.setFont("times", "italic");
    pdf.setFontSize(12);
    pdf.setTextColor(80);
    pdf.text(`Généré le : ${new Date().toLocaleString()}`, pageWidth / 2, currentY, {
      align: "center"
    });
    currentY += 15;

    // Statistiques Globales
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 100);
    pdf.text("Statistiques Globales", 14, currentY);
    currentY += 8;

    autoTable(pdf, {
      startY: currentY,
      head: [["Indicateur", "Valeur"]],
      body: [
        ["Total des Tickets", globalStats.globalStats?.totalTickets || "N/A"],
        ["Tickets Fermés", globalStats.globalStats?.totalClosed || "N/A"],
        ["Tickets Ouverts", globalStats.globalStats?.totalOpen || "N/A"],
        ["Temps Moyen de Résolution", globalStats.globalStats?.avgResolutionTime || "N/A"],
        ["Âge Moyen des Tickets Ouverts", globalStats.globalStats?.avgOpenAge || "N/A"],
        ["Taux de Satisfaction", globalStats.globalStats?.satisfactionRate || "N/A"]
      ],
      styles: { 
        halign: "left",
        fontSize: 11,
        cellPadding: 5,
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [63, 81, 181],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: 'bold', textColor: [40, 40, 100] },
        1: { cellWidth: 'auto', halign: 'center', fontStyle: 'bold', textColor: [0, 0, 0] }
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      margin: { left: 14, right: 14 }
    });

    currentY = pdf.lastAutoTable.finalY + 20;

    // GRAPH 1: Top 5 Catégories (Barres horizontales)
    pdf.addPage();
    currentY = 20;

    if (globalStats.countsByCategory) {
      const categoryData = Object.entries(globalStats.countsByCategory)
        .filter(([cat]) => cat !== "total")
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([label, value]) => ({ label, value }));
      
      currentY = drawHorizontalBarChart(
        pdf,
        categoryData,
        currentY,
        "Top 5 Catégories par Volume",
        [76, 175, 80]
      );
    }

    currentY += 15;

    // GRAPH 2: Répartition Tickets Ouverts/Fermés (Diagramme circulaire simplifié avec barres)
    if (globalStats.globalStats) {
      const statusData = [
        { label: "Tickets Fermés", value: globalStats.globalStats.totalClosed || 0 },
        { label: "Tickets Ouverts", value: globalStats.globalStats.totalOpen || 0 }
      ];
      
      currentY = drawHorizontalBarChart(
        pdf,
        statusData,
        currentY,
        "Répartition des Tickets par Statut",
        [63, 81, 181]
      );
    }

    currentY += 15;

    // GRAPH 3: Évolution Hebdomadaire (Graphique linéaire)
    let evolutionHebdo = globalStats.evolutionHebdomadaire || 
                         globalStats.data?.evolutionHebdomadaire || 
                         globalStats.statistics?.evolutionHebdomadaire;

    if (evolutionHebdo) {
      pdf.addPage();
      currentY = 20;
      
      // Calculer le total par semaine
      const weeklyTotals = { "S-4": 0, "S-3": 0, "S-2": 0, "S-1": 0, "S": 0 };
      
      Object.values(evolutionHebdo).forEach(category => {
        Object.entries(category).forEach(([week, count]) => {
          if (weeklyTotals.hasOwnProperty(week)) {
            weeklyTotals[week] += count;
          }
        });
      });
      
      const lineData = Object.entries(weeklyTotals).map(([label, value]) => ({ label, value }));
      
      drawLineChart(pdf, lineData, 20, currentY, 170, 70, "Évolution Hebdomadaire Globale");
      currentY += 85;
    }

    // Répartition par Catégorie (Tableau)
    pdf.addPage();
    currentY = 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 100);
    pdf.text("Répartition par Catégorie", 14, currentY);
    currentY += 8;

    const categoryData = [];
    if (globalStats.countsByCategory) {
      Object.entries(globalStats.countsByCategory).forEach(([category, count]) => {
        if (category !== "total") {
          const percentage = globalStats.categoryAnalysis?.[category]?.rate || "N/A";
          categoryData.push([category, count, percentage]);
        }
      });
    }

    autoTable(pdf, {
      startY: currentY,
      head: [["Catégorie", "Nombre de Tickets", "Pourcentage"]],
      body: categoryData,
      styles: { 
        halign: "left",
        fontSize: 10,
        cellPadding: 4,
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [76, 175, 80],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', textColor: [40, 40, 100] },
        1: { cellWidth: 'auto', halign: 'center' },
        2: { cellWidth: 'auto', halign: 'center', fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [245, 252, 245]
      },
      margin: { left: 14, right: 14 }
    });

    currentY = pdf.lastAutoTable.finalY + 20;

    // Performance par Région
    if (currentY > 220) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 100);
    pdf.text("Performance par Région", 14, currentY);
    currentY += 8;

    const regionData = [];
    if (globalStats.geographicalAnalysis) {
      Object.entries(globalStats.geographicalAnalysis.countsByRegion || {}).forEach(([region, count]) => {
        const satisfaction = globalStats.geographicalAnalysis.satisfactionRateByRegion?.[region] || "N/A";
        const avgTime = globalStats.geographicalAnalysis.avgResolutionTimeByRegion?.[region] || "N/A";
        regionData.push([region, count, satisfaction, avgTime]);
      });
    }

    autoTable(pdf, {
      startY: currentY,
      head: [["Région", "Tickets", "Satisfaction", "Temps Moyen"]],
      body: regionData,
      styles: { 
        halign: "left",
        fontSize: 9,
        cellPadding: 3.5,
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [255, 152, 0],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold', textColor: [40, 40, 100] },
        1: { cellWidth: 'auto', halign: 'center' },
        2: { cellWidth: 'auto', halign: 'center' },
        3: { cellWidth: 'auto', halign: 'center' }
      },
      alternateRowStyles: {
        fillColor: [255, 248, 240]
      },
      margin: { left: 14, right: 14 }
    });

    currentY = pdf.lastAutoTable.finalY + 20;

    // Vieillissement des Tickets Ouverts
    if (currentY > 220) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 100);
    pdf.text("Vieillissement des Tickets Ouverts", 14, currentY);
    currentY += 8;

    const agingData = [];
    if (globalStats.temporalAnalysis?.openTicketAging) {
      const aging = globalStats.temporalAnalysis.openTicketAging;
      const total = (aging.under7days || 0) + (aging.between7and30days || 0) + (aging.over30days || 0);
      
      agingData.push(
        ["Moins de 7 jours", aging.under7days || 0, total > 0 ? `${((aging.under7days / total) * 100).toFixed(2)}%` : "0%"],
        ["Entre 7 et 30 jours", aging.between7and30days || 0, total > 0 ? `${((aging.between7and30days / total) * 100).toFixed(2)}%` : "0%"],
        ["Plus de 30 jours", aging.over30days || 0, total > 0 ? `${((aging.over30days / total) * 100).toFixed(2)}%` : "0%"]
      );
    }

    autoTable(pdf, {
      startY: currentY,
      head: [["Période d'Âge", "Nombre de Tickets", "Pourcentage"]],
      body: agingData,
      styles: { 
        halign: "left",
        fontSize: 11,
        cellPadding: 5,
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [244, 67, 54],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', textColor: [40, 40, 100] },
        1: { cellWidth: 'auto', halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 'auto', halign: 'center', fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [255, 245, 245]
      },
      margin: { left: 14, right: 14 }
    });

    currentY = pdf.lastAutoTable.finalY + 20;

    // Top 5 Sites par Volume
    if (currentY > 220) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 100);
    pdf.text("Top 5 Sites par Volume de Tickets", 14, currentY);
    currentY += 8;

    const topSitesData = [];
    if (globalStats.assetAnalysis?.countsByName) {
      const sortedSites = Object.entries(globalStats.assetAnalysis.countsByName)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
      
      sortedSites.forEach(([site, count]) => {
        const satisfaction = globalStats.assetAnalysis.satisfactionRateByName?.[site] || "N/A";
        const avgTime = globalStats.assetAnalysis.avgResolutionTimeByName?.[site] || "N/A";
        topSitesData.push([site, count, satisfaction, avgTime]);
      });
    }

    autoTable(pdf, {
      startY: currentY,
      head: [["Site", "Tickets", "Satisfaction", "Temps Moyen"]],
      body: topSitesData,
      styles: { 
        halign: "left",
        fontSize: 10,
        cellPadding: 4,
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [156, 39, 176],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', textColor: [40, 40, 100] },
        1: { cellWidth: 'auto', halign: 'center' },
        2: { cellWidth: 'auto', halign: 'center' },
        3: { cellWidth: 'auto', halign: 'center' }
      },
      alternateRowStyles: {
        fillColor: [248, 245, 250]
      },
      margin: { left: 14, right: 14 }
    });

    currentY = pdf.lastAutoTable.finalY + 20;

    // Balance Âgée des Besoins
    if (currentY > 200) {
      pdf.addPage();
      currentY = 20;
    }

    if (balanceStats.balanceAgeeDesBesoins) {
      const { currentWeek, previousWeek, variation } = balanceStats.balanceAgeeDesBesoins;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 100);
      pdf.text("Balance Âgée des Besoins", 14, currentY);
      currentY += 10;

      autoTable(pdf, {
        startY: currentY,
        head: [["Période", "Moins de 10 j", "10 à 20 j", "20 à 30 j", "Plus de 30 j"]],
        body: [
          [
            "Semaine Actuelle", 
            currentWeek["Moins de 10 j"], 
            currentWeek["10 à 20 j"], 
            currentWeek["20 à 30 j"] || currentWeek["20 à 30"], 
            currentWeek["Plus de 30"]
          ],
          [
            "Semaine Précédente", 
            previousWeek["Moins de 10 j"], 
            previousWeek["10 à 20 j"], 
            previousWeek["20 à 30 j"] || previousWeek["20 à 30"], 
            previousWeek["Plus de 30"]
          ],
          [
            "Variation", 
            variation.under10, 
            variation.between10and20, 
            variation.between20and30, 
            variation.over30
          ]
        ],
        styles: { 
          halign: "center",
          fontSize: 10,
          cellPadding: 4,
          lineColor: [220, 220, 220],
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [100, 149, 237],
          textColor: 255,
          fontSize: 11,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [40, 40, 100], halign: 'left' }
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        },
        margin: { left: 14, right: 14 }
      });

      currentY = pdf.lastAutoTable.finalY + 20;
    }

    // Évolution Hebdomadaire
    evolutionHebdo = globalStats.evolutionHebdomadaire || 
                     globalStats.data?.evolutionHebdomadaire || 
                     globalStats.statistics?.evolutionHebdomadaire;

    if (evolutionHebdo) {
      if (currentY > 200) {
        pdf.addPage();
        currentY = 20;
      }

      const mergedHebdo = mergeEquipmentCategories(evolutionHebdo);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 100);
      pdf.text("Évolution Hebdomadaire par Catégorie", 14, currentY);
      currentY += 10;

      const hebdoHeaders = ["Catégorie", "S-4", "S-3", "S-2", "S-1", "S"];
      const hebdoBody = [];

      Object.entries(mergedHebdo).forEach(([category, data]) => {
        hebdoBody.push([
          category,
          data["S-4"] || 0,
          data["S-3"] || 0,
          data["S-2"] || 0,
          data["S-1"] || 0,
          data["S"] || 0
        ]);
      });

      autoTable(pdf, {
        startY: currentY,
        head: [hebdoHeaders],
        body: hebdoBody,
        styles: { 
          halign: "center",
          fontSize: 9,
          cellPadding: 4,
          lineColor: [220, 220, 220],
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [34, 139, 34],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10
        },
        columnStyles: {
          0: {cellWidth: 60, halign: 'left', fontStyle: 'bold', textColor: [40, 40, 100]},
          1: {cellWidth: 'auto'},
          2: {cellWidth: 'auto'},
          3: {cellWidth: 'auto'},
          4: {cellWidth: 'auto'},
          5: {cellWidth: 'auto'}
        },
        alternateRowStyles: {
          fillColor: [245, 255, 245]
        },
        margin: { left: 14, right: 14 }
      });

      currentY = pdf.lastAutoTable.finalY + 20;
    }

    // Évolution Mensuelle
    let evolutionMensuelle = globalStats.evolutionMensuelle || 
                             globalStats.data?.evolutionMensuelle || 
                             globalStats.statistics?.evolutionMensuelle;

    if (evolutionMensuelle) {
      const mergedMensuel = mergeEquipmentCategories(evolutionMensuelle);

      pdf.addPage();
      currentY = 20;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 100);
      pdf.text("Évolution Mensuelle par Catégorie", 14, currentY);
      currentY += 10;

      const moisOrdre = [
        "décembre 2024", "janvier 2025", "février 2025", "mars 2025", 
        "avril 2025", "mai 2025", "juin 2025", "juillet 2025", 
        "août 2025", "septembre 2025"
      ];

      const mensuelHeaders = ["Catégorie", ...moisOrdre];
      const mensuelBody = [];

      Object.entries(mergedMensuel).forEach(([category, data]) => {
        const row = [category];
        moisOrdre.forEach(mois => {
          row.push(data[mois] || 0);
        });
        mensuelBody.push(row);
      });

      autoTable(pdf, {
        startY: currentY,
        head: [mensuelHeaders],
        body: mensuelBody,
        styles: { 
          halign: "center",
          fontSize: 7,
          cellPadding: 2.5,
          lineColor: [220, 220, 220],
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [139, 0, 0],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 7
        },
        columnStyles: {
          0: {cellWidth: 35, halign: 'left', fontStyle: 'bold', textColor: [40, 40, 100]}
        },
        alternateRowStyles: {
          fillColor: [255, 245, 245]
        },
        tableWidth: 'auto',
        margin: { left: 10, right: 10 }
      });
    }

    pdf.save(`rapport_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Générateur de Rapport</DialogTitle>
      <DialogContent>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <CircularProgress />
            <Typography style={{ marginLeft: '10px' }}>Chargement des données...</Typography>
          </div>
        )}
        {!loading && (!globalStats || !balanceStats) && (
          <Typography color="error">
            Impossible de charger les données. Vérifiez votre connexion et l'API.
          </Typography>
        )}
        {!loading && globalStats && balanceStats && (
          <div>
            <Typography paragraph>
              Cliquez sur "Générer PDF" pour télécharger le rapport complet incluant :
            </Typography>
            <ul>
              <li>Statistiques globales</li>
              <li>Graphique : Top 5 catégories par volume</li>
              <li>Graphique : Répartition des tickets par statut</li>
              <li>Graphique : Évolution hebdomadaire globale</li>
              <li>Répartition par catégorie</li>
              <li>Performance par région</li>
              <li>Vieillissement des tickets ouverts</li>
              <li>Top 5 sites par volume</li>
              <li>Balance âgée des besoins</li>
              <li>Évolution hebdomadaire par catégorie</li>
              <li>Évolution mensuelle par catégorie</li>
            </ul>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
        <Button
          onClick={handleGeneratePdf}
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
          disabled={loading || !globalStats || !balanceStats}
        >
          Générer PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportGenerator;