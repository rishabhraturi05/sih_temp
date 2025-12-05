"use client";
import React, { useMemo } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 260;
const nodeHeight = 60;

const getLayoutedElements = (nodes, edges, direction = "LR") => {
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 80,   // Horizontal spacing between nodes in same rank (vertical branches)
    ranksep: 200,  // Vertical spacing between ranks (horizontal main flow)
    edgesep: 30    // Edge separation
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    // For LR (Left-to-Right) layout with vertical branches
    node.targetPosition = "left";
    node.sourcePosition = "right";
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

// 🎓 Career data nodes
const rawNodes = [
  // Starting points
  { id: "10th", data: { label: "After 10th" }, position: { x: 0, y: 0 } },
  { id: "12th", data: { label: "After 12th" }, position: { x: 0, y: 0 } },

  // After 10th branches
  { id: "iti", data: { label: "ITI Trades (Fitter, Electrician, Welder)" }, position: { x: 0, y: 0 } },
  { id: "paramedical", data: { label: "Paramedical Diplomas (MLT, GNM, ANM)" }, position: { x: 0, y: 0 } },
  { id: "poly", data: { label: "Polytechnic Diplomas (Mech, Civil, ECE)" }, position: { x: 0, y: 0 } },
  { id: "commerce10", data: { label: "Commerce Stream (10+2)" }, position: { x: 0, y: 0 } },
  { id: "arts10", data: { label: "Arts Stream (10+2)" }, position: { x: 0, y: 0 } },

  // After 12th branches - Science
  { id: "pcb", data: { label: "PCB / PCMB → Medical & Life Sciences" }, position: { x: 0, y: 0 } },
  { id: "pcm", data: { label: "PCM → Engineering & IT" }, position: { x: 0, y: 0 } },
  { id: "govt", data: { label: "Competitive Exams & Govt Careers" }, position: { x: 0, y: 0 } },
  
  // After 12th branches - Commerce
  { id: "commerce", data: { label: "Commerce Stream (B.Com, BBA, CA)" }, position: { x: 0, y: 0 } },
  { id: "finance", data: { label: "Finance & Banking" }, position: { x: 0, y: 0 } },
  
  // After 12th branches - Arts
  { id: "arts", data: { label: "Arts & Humanities" }, position: { x: 0, y: 0 } },
  { id: "law", data: { label: "Law & Legal Studies" }, position: { x: 0, y: 0 } },
  { id: "media", data: { label: "Media & Journalism" }, position: { x: 0, y: 0 } },

  // PCB details - Medical
  { id: "mbbs", data: { label: "MBBS, BDS, BAMS, BHMS" }, position: { x: 0, y: 0 } },
  { id: "bscagri", data: { label: "B.Sc Agriculture, Biotech, Microbiology" }, position: { x: 0, y: 0 } },
  { id: "researchpcb", data: { label: "M.Sc, Ph.D., Research Careers" }, position: { x: 0, y: 0 } },
  { id: "pharmacy", data: { label: "B.Pharm, D.Pharm, Pharma Research" }, position: { x: 0, y: 0 } },
  { id: "nursing", data: { label: "B.Sc Nursing, GNM, ANM" }, position: { x: 0, y: 0 } },
  { id: "veterinary", data: { label: "BVSc, Veterinary Science" }, position: { x: 0, y: 0 } },

  // PCM details - Engineering
  { id: "be", data: { label: "B.E. / B.Tech (CSE, ECE, Mech, Civil)" }, position: { x: 0, y: 0 } },
  { id: "cs", data: { label: "B.Sc CS, BCA, Data Science, AI/ML" }, position: { x: 0, y: 0 } },
  { id: "mtech", data: { label: "M.Tech, MCA, Specialized Engineering" }, position: { x: 0, y: 0 } },
  { id: "architecture", data: { label: "B.Arch, M.Arch, Urban Planning" }, position: { x: 0, y: 0 } },
  { id: "aviation", data: { label: "Pilot Training, Aerospace Engineering" }, position: { x: 0, y: 0 } },
  { id: "defense", data: { label: "NDA, CDS, Armed Forces" }, position: { x: 0, y: 0 } },

  // Commerce details
  { id: "bcom", data: { label: "B.Com, BBA, Business Studies" }, position: { x: 0, y: 0 } },
  { id: "ca", data: { label: "CA, CS, CMA, Financial Advisor" }, position: { x: 0, y: 0 } },
  { id: "mba", data: { label: "MBA, PGDM, Business Management" }, position: { x: 0, y: 0 } },
  { id: "banking", data: { label: "Banking, Insurance, Investment" }, position: { x: 0, y: 0 } },
  { id: "accounting", data: { label: "Accounting, Auditing, Taxation" }, position: { x: 0, y: 0 } },

  // Arts details
  { id: "ba", data: { label: "B.A. (History, Pol Science, Literature)" }, position: { x: 0, y: 0 } },
  { id: "teaching", data: { label: "B.Ed, M.Ed, Teaching Careers" }, position: { x: 0, y: 0 } },
  { id: "psychology", data: { label: "Psychology, Counseling, Social Work" }, position: { x: 0, y: 0 } },
  { id: "design", data: { label: "Fashion Design, Interior Design, Fine Arts" }, position: { x: 0, y: 0 } },
  { id: "llb", data: { label: "LLB, LLM, Legal Practice" }, position: { x: 0, y: 0 } },
  { id: "journalism", data: { label: "Journalism, Mass Communication, PR" }, position: { x: 0, y: 0 } },

  // Govt details
  { id: "ies", data: { label: "Engineering Services (IES)" }, position: { x: 0, y: 0 } },
  { id: "ias", data: { label: "Civil Services (IAS, IPS, IFS)" }, position: { x: 0, y: 0 } },
  { id: "railway", data: { label: "Railways, SSC, PSU Jobs" }, position: { x: 0, y: 0 } },
  { id: "defensegovt", data: { label: "Defense Services, Paramilitary" }, position: { x: 0, y: 0 } },
];

const rawEdges = [
  // After 10th connections
  { id: "e1", source: "10th", target: "iti" },
  { id: "e2", source: "10th", target: "paramedical" },
  { id: "e3", source: "10th", target: "poly" },
  { id: "e4", source: "10th", target: "commerce10" },
  { id: "e5", source: "10th", target: "arts10" },

  // After 12th - Science connections
  { id: "e6", source: "12th", target: "pcb" },
  { id: "e7", source: "12th", target: "pcm" },
  { id: "e8", source: "12th", target: "govt" },
  
  // After 12th - Commerce connections
  { id: "e9", source: "12th", target: "commerce" },
  { id: "e10", source: "12th", target: "finance" },
  
  // After 12th - Arts connections
  { id: "e11", source: "12th", target: "arts" },
  { id: "e12", source: "12th", target: "law" },
  { id: "e13", source: "12th", target: "media" },

  // PCB - Medical paths
  { id: "e14", source: "pcb", target: "mbbs" },
  { id: "e15", source: "pcb", target: "bscagri" },
  { id: "e16", source: "pcb", target: "researchpcb" },
  { id: "e17", source: "pcb", target: "pharmacy" },
  { id: "e18", source: "pcb", target: "nursing" },
  { id: "e19", source: "pcb", target: "veterinary" },

  // PCM - Engineering paths
  { id: "e20", source: "pcm", target: "be" },
  { id: "e21", source: "pcm", target: "cs" },
  { id: "e22", source: "pcm", target: "mtech" },
  { id: "e23", source: "pcm", target: "architecture" },
  { id: "e24", source: "pcm", target: "aviation" },
  { id: "e25", source: "pcm", target: "defense" },

  // Commerce paths
  { id: "e26", source: "commerce", target: "bcom" },
  { id: "e27", source: "commerce", target: "ca" },
  { id: "e28", source: "commerce", target: "mba" },
  { id: "e29", source: "finance", target: "banking" },
  { id: "e30", source: "finance", target: "accounting" },
  { id: "e31", source: "bcom", target: "mba" },
  { id: "e32", source: "bcom", target: "ca" },

  // Arts paths
  { id: "e33", source: "arts", target: "ba" },
  { id: "e34", source: "arts", target: "teaching" },
  { id: "e35", source: "arts", target: "psychology" },
  { id: "e36", source: "arts", target: "design" },
  { id: "e37", source: "law", target: "llb" },
  { id: "e38", source: "media", target: "journalism" },

  // Govt paths
  { id: "e39", source: "govt", target: "ies" },
  { id: "e40", source: "govt", target: "ias" },
  { id: "e41", source: "govt", target: "railway" },
  { id: "e42", source: "govt", target: "defensegovt" },
  { id: "e43", source: "defense", target: "defensegovt" },
];

export default function CareerFlowchart() {
  const { nodes, edges } = useMemo(
    () => getLayoutedElements(rawNodes, rawEdges, "LR"), // LR = Left-to-Right main flow with vertical branches
    []
  );

  return (
    <div 
      style={{ 
        width: "100%", 
        height: "100vh", 
        overflow: "hidden"
      }} 
      className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F172A]"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ 
          padding: 0.15,
          includeHiddenNodes: false,
          maxZoom: 1.5,
          minZoom: 0.15
        }}
        attributionPosition="top-right"
        minZoom={0.15}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      >
        <Background gap={12} size={1} color="#4a5568" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
