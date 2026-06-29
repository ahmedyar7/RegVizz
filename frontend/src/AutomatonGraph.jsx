import React, { useEffect, useRef } from "react";
import { Network, DataSet } from "vis-network/standalone";

export default function AutomatonGraph({ graphData, type }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  const isNFA = type.includes("NFA");
  const accentColor = isNFA ? "#3b82f6" : "#a855f7";
  const accentLight = isNFA ? "#dbeafe" : "#f3e8ff";

  useEffect(() => {
    if (!containerRef.current || !graphData?.nodes) return;

    if (networkRef.current) networkRef.current.destroy();

    const nodes = new DataSet(
      graphData.nodes.map((node) => {
        let bgColor = "#ffffff";
        let bdColor = "#94a3b8";
        let fontColor = "#1e293b";

        if (node.isStart) {
          bgColor = accentLight;
          bdColor = accentColor;
        }
        if (node.isAccept) {
          bgColor = "#dcfce7";
          bdColor = "#16a34a";
          fontColor = "#14532d";
        }
        if (node.isStart && node.isAccept) {
          bgColor = "#dcfce7";
          bdColor = "#16a34a";
          fontColor = "#14532d";
        }

        return {
          id: node.id,
          label: node.label,
          shape: "ellipse",
          size: 30,
          color: {
            background: bgColor,
            border: bdColor,
            highlight: { background: bgColor, border: accentColor },
            hover: { background: bgColor, border: accentColor },
          },
          borderWidth: 2.5,
          borderWidthSelected: 4,
          font: {
            size: 15,
            face: "monospace, sans-serif",
            color: fontColor,
            bold: {
              size: 15,
              face: "monospace, sans-serif",
              color: fontColor,
              mod: "bold",
            },
          },
          isStart: node.isStart,
          isAccept: node.isAccept,
          shadow: {
            enabled: true,
            color: "rgba(0,0,0,0.08)",
            size: 8,
            x: 0,
            y: 2,
          },
        };
      }),
    );

    const edges = new DataSet(
      graphData.edges.map((edge, i) => ({
        id: `e-${i}`,
        from: edge.source,
        to: edge.target,
        label: edge.label || "",
        arrows: {
          to: { enabled: true, scaleFactor: 0.85, type: "arrow" },
        },
        color: {
          color: "#64748b",
          highlight: accentColor,
          hover: accentColor,
          opacity: 1,
        },
        width: 2,
        hoverWidth: 3,
        selectionWidth: 3,
        smooth:
          edge.source === edge.target
            ? { enabled: true, type: "curvedCW", roundness: 0.7 }
            : { enabled: true, type: "dynamic", roundness: 0.4 },
        font: {
          size: 13,
          face: "system-ui, sans-serif",
          color: "#0f172a",
          strokeWidth: 4,
          strokeColor: "#ffffff",
          align: "middle",
          bold: {
            size: 13,
            face: "system-ui, sans-serif",
            color: "#0f172a",
            mod: "bold",
          },
        },
        // Label background pill
        background: {
          enabled: true,
          color: "#ffffff",
          size: 4,
          dashes: false,
        },
      })),
    );

    const options = {
      physics: {
        enabled: true,
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          gravitationalConstant: -80,
          centralGravity: 0.01,
          springLength: 160,
          springConstant: 0.06,
          damping: 0.92,
          avoidOverlap: 1,
        },
        stabilization: { iterations: 300, fit: true },
      },
      interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true,
        hover: true,
        tooltipDelay: 100,
        multiselect: false,
      },
      layout: { improvedLayout: true },
    };

    networkRef.current = new Network(
      containerRef.current,
      { nodes, edges },
      options,
    );

    // Draw start arrows + accept double rings on every frame
    networkRef.current.on("afterDrawing", (ctx) => {
      // Accept state — outer ring
      graphData.nodes
        .filter((n) => n.isAccept)
        .forEach((n) => {
          const pos = networkRef.current.getPosition(n.id);
          ctx.save();
          ctx.strokeStyle = "#16a34a";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(pos.x, pos.y, 38, 38, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });

      // Start state — entry arrow
      graphData.nodes
        .filter((n) => n.isStart)
        .forEach((n) => {
          const pos = networkRef.current.getPosition(n.id);
          const x = pos.x - 30; // node left edge
          const y = pos.y;
          const arrowLen = 44;

          ctx.save();
          ctx.strokeStyle = accentColor;
          ctx.fillStyle = accentColor;
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";

          // Line
          ctx.beginPath();
          ctx.moveTo(x - arrowLen, y);
          ctx.lineTo(x - 2, y);
          ctx.stroke();

          // Arrowhead
          ctx.beginPath();
          ctx.moveTo(x - 14, y - 7);
          ctx.lineTo(x - 1, y);
          ctx.lineTo(x - 14, y + 7);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        });
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [graphData, accentColor, accentLight]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
      }}>
      {/* Header */}
      <div
        style={{
          padding: "9px 16px",
          borderBottom: "1px solid #e2e8f0",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: accentColor,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
          {type}
        </span>

        {/* Legend */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}>
          {[
            { color: accentColor, bg: accentLight, label: "Start" },
            { color: "#16a34a", bg: "#dcfce7", label: "Accept", double: true },
            { color: "#94a3b8", bg: "#ffffff", label: "State" },
          ].map(({ color, bg, label, double: dbl }) => (
            <span
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#64748b",
              }}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: bg,
                  border: `2px solid ${color}`,
                  outline: dbl ? `2px solid ${color}` : "none",
                  outlineOffset: 2,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {label}
            </span>
          ))}
          <span
            style={{
              fontSize: 11,
              color: "#94a3b8",
              borderLeft: "1px solid #e2e8f0",
              paddingLeft: 10,
            }}>
            drag · scroll to zoom
          </span>
        </div>
      </div>

      {/* Graph canvas */}
      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }} />
    </div>
  );
}
