"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import anime from "animejs";
import "animate.css";

// Interfaz del estado con TODOS tus campos (incluyendo todos los que aparecen en las 86 preguntas)
interface FormDataType {
  [key: string]: any; // Para simplificar la definición de tantos campos

  name: string;
  email: string;
  responses: string;
  firstName: string;
  lastName: string;
  age: string;
  postalCode: string;
  educationPreference: string;
  willingToRelocate: string;
  favoriteClasses: string[];
  toolSkill: string;
  physicalTaskComfort: string;
  mechanicalSkill: string;
  manualToolSkill: string;
  manualDexterity: string;
  machineComfort: string;
  dirtyHandsWillingness: string;
  programmingToolsInterest: string;
  specializedMachineInterest: string;
  taskMeticulousness: string;
  equipmentMaintenanceInterest: string;
  physicalEffortValue: string;
  personalProtectionComfort: string;
  emotionalExpression: string;
  writingSkill: string;
  imaginationSkill: string;
  newIdeasInterest: string;
  artisticActivities: string;
  musicalSkill: string;
  artisticWorkComfort: string;
  artInspiration: string;
  creativeFreedomValue: string;
  artisticToolsInterest: string;
  innovativeProblemSolving: string;
  originality: string;
  creativityMotivation: string;
  empathy: string;
  careForOthers: string;
  socialSkills: string;
  patience: string;
  socialServicesWillingness: string;
  interpersonalSkills: string;
  knowledgeSharing: string;
  emotionalExhaustion: string;
  humanitarianism: string;
  emotionalSupportWork: string;
  openCommunicationPreference: string;
  experimentComfort: string;
  learningDrive: string;
  mathPhysicsSkill: string;
  academicPerformance: string;
  researchCareerInterest: string;
  factFindingInterest: string;
  continuousLearningSatisfaction: string;
  softwareToolsSatisfaction: string;
  practicalApplicationConfidence: string;
  examPreparation: string;
  analyticalSkill: string;
  debateInterest: string;
  attentionToDetail: string;
  followingInstructions: string;
  goalPrecision: string;
  officeEquipmentSkill: string;
  proceduresComfort: string;
  administrativeSkill: string;
  fileManagementSkill: string;
  logisticsSkill: string;
  routineTaskComfort: string;
  organizationSkill: string;
  officeWorkInterest: string;
  structuredEnvironmentComfort: string;
  careerStabilityValue: string;
  entrepreneurInterest: string;
  salesSkill: string;
  influenceAbility: string;
  leadershipConfidence: string;
  socialStatusEffort: string;
  growthOpportunityIdentification: string;
  ideaTransformationMotivation: string;
  independentWorkPreference: string;
  negotiationSkill: string;
  businessTrendsInterest: string;
  materialSuccessValue: string;
  authorityPreference: string;
  ambitionPursuit: string;
  decisionMaking: string;
}

// Interfaz para las preguntas
interface QuestionProps {
  name: keyof FormDataType;
  label: string;
  type: "text" | "email" | "radio" | "checkbox" | "select" | "number";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

// TODAS las 86 preguntas (sin omitir nada):
const questions: QuestionProps[] = [
  {
    name: "email",
    label: "Correo electrónico",
    type: "email",
    placeholder: "Correo electrónico",
    required: true,
  },
  {
    name: "firstName",
    label: "Nombre(s)",
    type: "text",
    placeholder: "Nombre(s)",
    required: true,
  },
  {
    name: "lastName",
    label: "Apellido(s)",
    type: "text",
    placeholder: "Apellido(s)",
    required: true,
  },
  {
    name: "age",
    label: "Edad",
    type: "text",
    placeholder: "Edad",
    required: true,
  },
  {
    name: "postalCode",
    label: "Código Postal",
    type: "text",
    placeholder: "Código Postal",
  },
  {
    name: "educationPreference",
    label: "¿Qué tipo de educación te interesa tener?",
    type: "select",
    options: ["Presencial", "En línea", "Mixta", "Sin preferencia"],
  },
  {
    name: "willingToRelocate",
    label:
      "¿Estarías dispuesto a trasladarte a otro estado o municipio en busca de oportunidades escolares y laborales?",
    type: "radio",
    options: ["Sí", "No"],
  },
  {
    name: "favoriteClasses",
    label:
      "¿Cuáles son las clases que más se te facilitan y las que más te gustan?",
    type: "checkbox",
    options: [
      "Física",
      "Química",
      "Estadística y probabilidad",
      "Informática aplicada",
      "Geografía",
      "Álgebra",
      "Biología",
      "Biología humana",
      "Matemáticas",
      "Cálculo diferencial",
      "Cálculo integral",
      "Sociología",
      "Filosofía",
      "Historia",
      "Derecho",
      "Comunicación y medios",
      "Educación Física",
      "Salud integral del adolescente",
      "Metodología de la investigación",
      "Ética",
      "Taller de lectura y redacción",
      "Inglés",
      "Psicología",
      "Economía",
      "Ecología y Medio Ambiente",
      "Introducción de Ciencias Sociales",
      "Administración empresarial",
      "Contabilidad",
      "Electrónica Industrial",
      "Expresión gráfica industrial",
      "Informática",
      "Mecatrónica",
      "Sistemas automáticos",
      "Sistemas electrónicos",
      "Artes",
      "Etimologías grecolatinas",
      "Estructura socioeconómica y política de México",
      "Lógica",
      "Dibujo",
      "Orientación educativa",
      "Lenguaje adicional al español",
      "Problemas sociales, políticos y económicos de México",
    ],
  },
  {
    name: "toolSkill",
    label:
      "¿Cómo te desenvuelves usando herramientas como destornilladores, llaves inglesas o martillos?",
    type: "select",
    options: ["Muy mal", "Mal", "Neutral", "Bien", "Muy bien"],
  },
  {
    name: "physicalTaskComfort",
    label:
      "Si tu trabajo requiere levantar y mover objetos pesados o realizar tareas como cavar y cargar, ¿cómo te sentirías al respecto?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "mechanicalSkill",
    label:
      "¿Cómo describirías tu habilidad mecánica si te piden arreglar una bicicleta descompuesta?",
    type: "select",
    options: ["Muy limitada", "Limitada", "Neutral", "Buena", "Muy buena"],
  },
  {
    name: "manualToolSkill",
    label:
      "¿Qué tan bueno(a) eres para usar herramientas manuales o eléctricas como usar un taladro o una sierra?",
    type: "select",
    options: ["Muy malo(a)", "Malo(a)", "Neutral", "Bueno(a)", "Muy bueno(a)"],
  },
  {
    name: "manualDexterity",
    label:
      "¿Qué tan bueno(a) eres para utilizar tu destreza manual si estás trabajando en un proyecto que requiere precisión?",
    type: "select",
    options: ["Muy malo(a)", "Malo(a)", "Neutral", "Bueno(a)", "Muy bueno(a)"],
  },
  {
    name: "machineComfort",
    label: "¿Qué tan cómodo(a) te sientes trabajando con maquinaria motorizada?",
    type: "select",
    options: [
      "Muy incómodo(a)",
      "Incómodo(a)",
      "Neutral",
      "Cómodo(a)",
      "Muy cómodo(a)",
    ],
  },
  {
    name: "dirtyHandsWillingness",
    label:
      "¿Qué tan dispuesto(a) estás a ensuciarte las manos para completar tareas laborales si tu trabajo implicara manejar grasas de automóviles, tierra o pintura?",
    type: "select",
    options: [
      "Nada dispuesto(a)",
      "Poco dispuesto(a)",
      "Neutral",
      "Dispuesto(a)",
      "Muy dispuesto(a)",
    ],
  },
  {
    name: "programmingToolsInterest",
    label:
      "¿Cuánto deseas trabajar con herramientas como lenguajes de programación, Inteligencia Artificial, hardware y software?",
    type: "select",
    options: [
      "Muy desinteresado(a)",
      "Desinteresado(a)",
      "Neutral",
      "Deseoso(a)",
      "Muy deseoso(a)",
    ],
  },
  {
    name: "specializedMachineInterest",
    label:
      "¿Qué tan interesado(a) estarías en desempeñar un trabajo que involucre el manejo de maquinaria especializada?",
    type: "select",
    options: [
      "Muy desinteresado(a)",
      "Desinteresado(a)",
      "Neutral",
      "Interesado(a)",
      "Muy interesado(a)",
    ],
  },
  {
    name: "taskMeticulousness",
    label:
      "¿Qué tan importante es para ti ser meticuloso(a) y cuidadoso(a) en la ejecución de tus tareas diarias?",
    type: "select",
    options: [
      "Muy insignificante",
      "Insignificante",
      "Neutral",
      "Importante",
      "Muy importante",
    ],
  },
  {
    name: "equipmentMaintenanceInterest",
    label:
      "¿Te interesa encargarte del mantenimiento regular de equipos de cómputo y sistemas electrónicos?",
    type: "select",
    options: [
      "Muy desinteresado(a)",
      "Desinteresado(a)",
      "Neutral",
      "Interesado(a)",
      "Muy interesado(a)",
    ],
  },
  {
    name: "physicalEffortValue",
    label: "¿Cuánto valoras el esfuerzo físico en el trabajo?",
    type: "select",
    options: [
      "Muy infravalorado",
      "Infravalorado",
      "Neutral",
      "Valorado",
      "Muy valorado",
    ],
  },
  {
    name: "personalProtectionComfort",
    label: "¿Qué tan cómodo(a) te sientes utilizando equipo de protección personal?",
    type: "select",
    options: [
      "Muy incómodo(a)",
      "Incómodo(a)",
      "Neutral",
      "Cómodo(a)",
      "Muy cómodo(a)",
    ],
  },
  {
    name: "emotionalExpression",
    label: "¿Cómo evaluarías tu capacidad para expresar tus emociones?",
    type: "select",
    options: ["Muy baja", "Baja", "Neutral", "Alta", "Muy alta"],
  },
  {
    name: "writingSkill",
    label:
      "¿Cómo evaluarías tus destrezas para escribir literatura como poesía, prosa, cuentos o humor?",
    type: "select",
    options: ["Muy bajas", "Bajas", "Neutras", "Altas", "Muy altas"],
  },
  {
    name: "imaginationSkill",
    label: "¿Cómo evaluarías tu capacidad para utilizar la imaginación?",
    type: "select",
    options: ["Muy baja", "Baja", "Neutral", "Alta", "Muy alta"],
  },
  {
    name: "newIdeasInterest",
    label:
      "¿Disfrutas explorar nuevas ideas y conceptos que no han sido explorados por otros antes?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "artisticActivities",
    label:
      "¿Qué tanto disfrutas tomar parte en actividades artísticas como obras de teatro, bandas musicales o clubes de lectura?",
    type: "select",
    options: [
      "Es muy aburrido",
      "Es aburrido",
      "Neutral",
      "Lo disfruto",
      "Lo disfruto mucho",
    ],
  },
  {
    name: "musicalSkill",
    label:
      "¿Qué tan desarrollada sientes tu habilidad para ejecutar un instrumento musical?",
    type: "select",
    options: [
      "Muy subdesarrollada",
      "Subdesarrollada",
      "Neutral",
      "Desarrollada",
      "Muy desarrollada",
    ],
  },
  {
    name: "artisticWorkComfort",
    label:
      "¿Te sentirías cómodo(a) trabajando en una galería de arte, un estudio de música o una casa editorial?",
    type: "select",
    options: [
      "Muy incómodo(a)",
      "Incómodo(a)",
      "Neutral",
      "Cómodo(a)",
      "Muy cómodo(a)",
    ],
  },
  {
    name: "artInspiration",
    label: "¿Te sientes inspirado cuando estás rodeado de obras de arte y cultura?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "creativeFreedomValue",
    label:
      "¿Valoras más la libertad creativa en el trabajo que la estabilidad financiera?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "artisticToolsInterest",
    label:
      "¿Disfrutas usar herramientas artísticas, como pinceles, cámaras o software de diseño?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "innovativeProblemSolving",
    label:
      "¿Prefieres resolver problemas a través de métodos innovadores y no convencionales?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "originality",
    label: "¿Consideras que la originalidad es una de tus principales características?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "creativityMotivation",
    label:
      "¿Te motiva usar la creatividad para generar ideas únicas y atractivas en proyectos?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "empathy",
    label:
      "¿Qué tan fácil te resulta ponerte en el lugar de los demás y comprender sus sentimientos?",
    type: "select",
    options: ["Muy difícil", "Difícil", "Neutral", "Fácil", "Muy fácil"],
  },
  {
    name: "careForOthers",
    label:
      "¿Qué tan importante es para ti mostrar preocupación y cuidado por los demás cuando necesitan apoyo?",
    type: "select",
    options: [
      "Muy insignificante",
      "Insignificante",
      "Neutral",
      "Importante",
      "Muy importante",
    ],
  },
  {
    name: "socialSkills",
    label:
      "¿Consideras que tus destrezas sociales te permiten relacionarte fácilmente con las personas?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "patience",
    label:
      "¿Te consideras capaz de escuchar y entender a los demás con paciencia, especialmente en situaciones de asesoramiento?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "decisionMaking",
    label:
      "¿Evitas tomar decisiones precipitadas cuando sabes que puedes afectar a otras personas?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "socialServicesWillingness",
    label:
      "¿Estás dispuesto(a) a trabajar en una carrera que implique prestar servicios sociales o la enseñanza?",
    type: "select",
    options: [
      "Muy indispuesto(a)",
      "Indispuesto(a)",
      "Neutral",
      "Dispuesto(a)",
      "Muy dispuesto(a)",
    ],
  },
  {
    name: "interpersonalSkills",
    label:
      "¿Qué tan fuertes consideras tus dotes para las relaciones interpersonales y resolver conflictos?",
    type: "select",
    options: ["Muy carente", "Carente", "Neutral", "Dotado(a)", "Muy dotado(a)"],
  },
  {
    name: "knowledgeSharing",
    label:
      "¿Disfrutas compartir conocimientos y experiencias con otros para ayudarles a aprender y crecer?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "emotionalExhaustion",
    label:
      "¿Consideras que dedicarte a ayudar a las personas puede ser emocionalmente agotador?",
    type: "select",
    options: [
      "Muy de acuerdo",
      "De acuerdo",
      "Neutral",
      "En desacuerdo",
      "Muy en desacuerdo",
    ],
  },
  {
    name: "humanitarianism",
    label: "¿Qué tan importante es para ti el humanitarismo?",
    type: "select",
    options: [
      "Muy insignificante",
      "Insignificante",
      "Neutral",
      "Importante",
      "Muy importante",
    ],
  },
  {
    name: "emotionalSupportWork",
    label:
      "¿Te gustaría trabajar en un empleo donde puedas brindar apoyo emocional y psicológico a las personas?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "openCommunicationPreference",
    label:
      "¿Prefieres trabajar en entornos que fomenten la comunicación abierta y la colaboración entre colegas?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "experimentComfort",
    label: "¿Qué tan cómodo te sientes llevando a cabo experimentos?",
    type: "select",
    options: ["Muy incómodo", "Incómodo", "Neutral", "Cómodo", "Muy cómodo"],
  },
  {
    name: "learningDrive",
    label:
      "¿Qué tan fuerte es tu impulso por explorar, aprender y descubrir cosas (internet, libros, artículos científicos, etc.)?",
    type: "select",
    options: ["Muy bajo", "Bajo", "Neutral", "Alto", "Muy alto"],
  },
  {
    name: "mathPhysicsSkill",
    label:
      "¿Cómo calificarías tu habilidad para resolver problemas de matemáticas y física?",
    type: "select",
    options: ["Muy baja", "Baja", "Neutral", "Alta", "Muy alta"],
  },
  {
    name: "academicPerformance",
    label:
      "¿Te consideras alguien destacado en tus estudios académicos al resto de tus compañeros?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "researchCareerInterest",
    label:
      "¿Qué tan interesado(a) estás en trabajar en una carrera que implique investigación y análisis de datos?",
    type: "select",
    options: [
      "Muy desinteresado(a)",
      "Poco interesado(a)",
      "Neutral",
      "Interesado(a)",
      "Muy interesado(a)",
    ],
  },
  {
    name: "factFindingInterest",
    label: "¿Qué tan interesado(a) estás en descubrir hechos y obtener información precisa?",
    type: "select",
    options: [
      "Nada interesado(a)",
      "Poco interesado(a)",
      "Moderadamente interesado(a)",
      "Interesado(a)",
      "Muy interesado(a)",
    ],
  },
  {
    name: "continuousLearningSatisfaction",
    label:
      "¿Encuentras satisfactorio el proceso de aprender continuamente y expandir tus conocimientos?",
    type: "select",
    options: [
      "Muy insatisfecho(a)",
      "Insatisfecho(a)",
      "Neutral",
      "Satisfecho(a)",
      "Muy satisfecho(a)",
    ],
  },
  {
    name: "softwareToolsSatisfaction",
    label:
      "¿Encuentras gratificante usar herramientas de software para analizar información e investigar?",
    type: "select",
    options: [
      "Muy desagradable",
      "Desagradable",
      "Neutral",
      "Gratificante",
      "Muy gratificante",
    ],
  },
  {
    name: "practicalApplicationConfidence",
    label:
      "¿Qué tan seguro(a) te sientes aplicando tus conocimientos escolares y académicos en situaciones prácticas?",
    type: "select",
    options: [
      "Muy inseguro(a)",
      "Inseguro(a)",
      "Neutral",
      "Seguro(a)",
      "Muy seguro(a)",
    ],
  },
  {
    name: "examPreparation",
    label:
      "¿Qué tan bien comprendes y retienes la información necesaria para prepararte y rendir bien en un examen?",
    type: "select",
    options: ["Muy mal", "Mal", "Neutral", "Bien", "Muy bien"],
  },
  {
    name: "analyticalSkill",
    label: "¿Qué tan analítico(a) te consideras al resolver problemas o tomar decisiones?",
    type: "select",
    options: [
      "Muy sintético(a)",
      "Sintético(a)",
      "Neutral",
      "Analítico(a)",
      "Muy analítico(a)",
    ],
  },
  {
    name: "debateInterest",
    label:
      "¿Disfrutas participar en debates y discusiones que requieren un análisis profundo?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "attentionToDetail",
    label:
      "¿Cómo evaluarías tu nivel de atención a los detalles y tu capacidad para ser minucioso?",
    type: "select",
    options: ["Muy baja", "Baja", "Neutral", "Alta", "Muy alta"],
  },
  {
    name: "followingInstructions",
    label:
      "¿Qué tan bien crees que sigues instrucciones y procedimientos en diferentes tareas?",
    type: "select",
    options: ["Muy mal", "Mal", "Neutral", "Bien", "Muy bien"],
  },
  {
    name: "goalPrecision",
    label: "¿Cómo evaluarías tu capacidad para ajustarte a metas precisas en tus proyectos?",
    type: "select",
    options: ["Muy baja", "Baja", "Neutral", "Alta", "Muy alta"],
  },
  {
    name: "officeEquipmentSkill",
    label:
      "¿Cómo calificarías tu habilidad para manejar aparatos de oficina como laptops, impresoras, etc.?",
    type: "select",
    options: ["Muy baja", "Baja", "Neutral", "Alta", "Muy alta"],
  },
  {
    name: "proceduresComfort",
    label:
      "¿Te sientes cómodo(a) trabajando en entornos donde se requiere seguir procedimientos y reglas específicas?",
    type: "select",
    options: [
      "Muy incómodo(a)",
      "Incómodo(a)",
      "Neutral",
      "Cómodo(a)",
      "Muy cómodo(a)",
    ],
  },
  {
    name: "administrativeSkill",
    label:
      "¿Qué tan hábil te consideras para realizar tareas administrativas con orden y precisión?",
    type: "select",
    options: ["Muy inhábil", "Inhábil", "Neutral", "Hábil", "Muy hábil"],
  },
  {
    name: "fileManagementSkill",
    label:
      "¿Qué tan efectivo(a) te consideras en el manejo ordenado y sistemático de archivos y registros?",
    type: "select",
    options: [
      "Nada efectivo(a)",
      "Algo efectivo(a)",
      "Neutral",
      "Efectivo(a)",
      "Muy efectivo(a)",
    ],
  },
  {
    name: "logisticsSkill",
    label:
      "Eres el responsable de la logística en una empresa de distribución de alimentos. ¿Cómo calificarías tu habilidad para llevar a cabo tareas administrativas de manera práctica y eficiente?",
    type: "select",
    options: ["Muy baja", "Baja", "Neutral", "Alta", "Muy alta"],
  },
  {
    name: "routineTaskComfort",
    label:
      "¿Qué tan cómodo(a) te sientes al llevar a cabo actividades rutinarias en tu trabajo o estudio diario?",
    type: "select",
    options: [
      "Muy incómodo(a)",
      "Incómodo(a)",
      "Neutral",
      "Cómodo(a)",
      "Muy cómodo(a)",
    ],
  },
  {
    name: "organizationSkill",
    label:
      "¿Disfrutas organizar y planificar tu trabajo para asegurarte de cumplir con los objetivos establecidos?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "officeWorkInterest",
    label:
      "¿Te interesa trabajar en campos como la contabilidad, la administración o la gestión de oficinas?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "structuredEnvironmentComfort",
    label:
      "¿Qué tan cómodo(a) te sientes al trabajar en un ambiente estructurado y organizado?",
    type: "select",
    options: [
      "Muy incómodo(a)",
      "Incómodo(a)",
      "Neutral",
      "Cómodo(a)",
      "Muy cómodo(a)",
    ],
  },
  {
    name: "careerStabilityValue",
    label: "¿Qué tanto valoras la estabilidad y seguridad en tu carrera profesional?",
    type: "select",
    options: [
      "Muy infravalorado",
      "Infravalorado",
      "Neutral",
      "Valorado",
      "Muy valorado",
    ],
  },
  {
    name: "entrepreneurInterest",
    label:
      "Si tienes una idea para un nuevo producto y la oportunidad de crear tu propia empresa, ¿qué tan interesado(a) estarías en hacerlo?",
    type: "select",
    options: [
      "Muy desinteresado(a)",
      "Desinteresado(a)",
      "Neutral",
      "Interesado(a)",
      "Muy interesado(a)",
    ],
  },
  {
    name: "salesSkill",
    label: "¿Qué tan eficaz te consideras en el arte de las ventas y la persuasión?",
    type: "select",
    options: ["Muy ineficaz", "Ineficaz", "Neutral", "Eficaz", "Muy eficaz"],
  },
  {
    name: "influenceAbility",
    label:
      "¿Cómo te sientes con respecto a tu capacidad para influir y generar impacto en situaciones y decisiones importantes?",
    type: "select",
    options: [
      "Muy limitado(a)",
      "Limitado(a)",
      "Neutral",
      "Amplio(a)",
      "Muy amplio(a)",
    ],
  },
  {
    name: "leadershipConfidence",
    label:
      "¿Qué tan seguro(a) te sientes al asumir roles de liderazgo (decisiones, motivar, estrategia)?",
    type: "select",
    options: [
      "Muy inseguro(a)",
      "Inseguro(a)",
      "Neutral",
      "Seguro(a)",
      "Muy seguro(a)",
    ],
  },
  {
    name: "socialStatusEffort",
    label:
      "¿Te esfuerzas por mejorar tu posición social y ser visto(a) como una persona de éxito?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "growthOpportunityIdentification",
    label:
      "Imagina que eres dueño(a) de una pequeña empresa, ¿serías capaz de identificar oportunidades y amenazas para impulsar su crecimiento?",
    type: "select",
    options: ["Muy incapaz", "Incapaz", "Neutral", "Capaz", "Muy capaz"],
  },
  {
    name: "ideaTransformationMotivation",
    label:
      "¿Te motiva el desafío de transformar ideas en realidades concretas y exitosas?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "independentWorkPreference",
    label:
      "¿Prefieres trabajar de manera independiente y tomar tus propias decisiones en lugar de seguir instrucciones?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "negotiationSkill",
    label: "¿Te consideras una persona con habilidades para negociar y cerrar acuerdos?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "businessTrendsInterest",
    label:
      "¿Disfrutas aprender sobre nuevas tendencias y tecnologías en el ámbito empresarial?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "materialSuccessValue",
    label:
      "¿Qué tan importante consideras la adquisición de bienes materiales y el éxito económico en tu vida?",
    type: "select",
    options: [
      "Muy irrelevante",
      "Irrelevante",
      "Neutral",
      "Importante",
      "Muy importante",
    ],
  },
  {
    name: "authorityPreference",
    label:
      "¿Prefieres posiciones de autoridad donde puedas influir significativamente en el rumbo de una organización?",
    type: "select",
    options: [
      "Muy en desacuerdo",
      "En desacuerdo",
      "Neutral",
      "De acuerdo",
      "Muy de acuerdo",
    ],
  },
  {
    name: "ambitionPursuit",
    label:
      "¿Qué tan dispuesto(a) estás a perseguir metas ambiciosas y a esforzarte para lograr resultados destacados?",
    type: "select",
    options: [
      "Muy indispuesto(a)",
      "Indispuesto(a)",
      "Neutral",
      "Dispuesto(a)",
      "Muy dispuesto(a)",
    ],
  },
  // 85) decisionMaking
  // (Si ya se incluyó en #39, no lo duplicamos)
  // 86) responses (opcional) ...
];

// Barra de progreso
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="progressContainer">
    <div className="progressBar" style={{ width: `${progress}%` }}></div>
  </div>
);

export default function UserForm() {
  const router = useRouter();

  // Estado inicial con TODOS los campos en blanco o arrays vacíos
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    responses: "",
    firstName: "",
    lastName: "",
    age: "",
    postalCode: "",
    educationPreference: "",
    willingToRelocate: "",
    favoriteClasses: [],
    toolSkill: "",
    physicalTaskComfort: "",
    mechanicalSkill: "",
    manualToolSkill: "",
    manualDexterity: "",
    machineComfort: "",
    dirtyHandsWillingness: "",
    programmingToolsInterest: "",
    specializedMachineInterest: "",
    taskMeticulousness: "",
    equipmentMaintenanceInterest: "",
    physicalEffortValue: "",
    personalProtectionComfort: "",
    emotionalExpression: "",
    writingSkill: "",
    imaginationSkill: "",
    newIdeasInterest: "",
    artisticActivities: "",
    musicalSkill: "",
    artisticWorkComfort: "",
    artInspiration: "",
    creativeFreedomValue: "",
    artisticToolsInterest: "",
    innovativeProblemSolving: "",
    originality: "",
    creativityMotivation: "",
    empathy: "",
    careForOthers: "",
    socialSkills: "",
    patience: "",
    socialServicesWillingness: "",
    interpersonalSkills: "",
    knowledgeSharing: "",
    emotionalExhaustion: "",
    humanitarianism: "",
    emotionalSupportWork: "",
    openCommunicationPreference: "",
    experimentComfort: "",
    learningDrive: "",
    mathPhysicsSkill: "",
    academicPerformance: "",
    researchCareerInterest: "",
    factFindingInterest: "",
    continuousLearningSatisfaction: "",
    softwareToolsSatisfaction: "",
    practicalApplicationConfidence: "",
    examPreparation: "",
    analyticalSkill: "",
    debateInterest: "",
    attentionToDetail: "",
    followingInstructions: "",
    goalPrecision: "",
    officeEquipmentSkill: "",
    proceduresComfort: "",
    administrativeSkill: "",
    fileManagementSkill: "",
    logisticsSkill: "",
    routineTaskComfort: "",
    organizationSkill: "",
    officeWorkInterest: "",
    structuredEnvironmentComfort: "",
    careerStabilityValue: "",
    entrepreneurInterest: "",
    salesSkill: "",
    influenceAbility: "",
    leadershipConfidence: "",
    socialStatusEffort: "",
    growthOpportunityIdentification: "",
    ideaTransformationMotivation: "",
    independentWorkPreference: "",
    negotiationSkill: "",
    businessTrendsInterest: "",
    materialSuccessValue: "",
    authorityPreference: "",
    ambitionPursuit: "",
    decisionMaking: "",
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");

  // Animación cuando cambia la pregunta
  useEffect(() => {
    anime({
      targets: ".question-container",
      translateY: [20, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      delay: 200,
    });
  }, [currentIndex]);

  // Carga desde localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  // Guarda en localStorage
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const currentQuestion = questions[currentIndex];
  const remaining = totalQuestions - (currentIndex + 1);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const questionDef = questions.find((q) => q.name === name);

    // Checkbox
    if (questionDef?.type === "checkbox" && e.target instanceof HTMLInputElement) {
      const checked = e.target.checked;
      const prevArray = formData[name] as string[];
      let updatedArray = [...prevArray];
      if (checked) {
        updatedArray.push(value);
      } else {
        updatedArray = updatedArray.filter((item) => item !== value);
      }
      setFormData({ ...formData, [name]: updatedArray });
    } else {
      // Radio, select, text, email, number
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => {
    if (currentQuestion.required) {
      const answer = formData[currentQuestion.name];
      if ((Array.isArray(answer) && answer.length === 0) || (!Array.isArray(answer) && !answer)) {
        setError("Este campo es obligatorio.");
        return;
      }
    }
    setError("");
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setError("");
    }
  };

  // Enviar al final (sin <form>)
  const handleSubmit = async () => {
    // Validar la última pregunta
    if (currentQuestion.required) {
      const answer = formData[currentQuestion.name];
      if ((Array.isArray(answer) && answer.length === 0) || (!Array.isArray(answer) && !answer)) {
        setError("Este campo es obligatorio.");
        return;
      }
    }
    setError("");

    // Construir fullName
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const dataToSend = { ...formData, name: fullName };

    console.log("Datos enviados al backend:", dataToSend);

    try {
      const response = await fetch("/api/form-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        alert("Error al enviar el formulario.");
        return;
      }

      const { sessionId } = await response.json();
      if (!sessionId) {
        alert("No se recibió sessionId desde el servidor.");
        return;
      }

      alert("¡Formulario enviado exitosamente!");
      // localStorage.removeItem("formData"); // Opcional

      router.push(`/examples/all?sessionId=${sessionId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Ocurrió un error al enviar el formulario.");
    }
  };

  return (
    <div className="form-container animate__animated animate__fadeIn">
      {/* Barra de progreso */}
      <ProgressBar progress={progress} />

      {/* Contador de preguntas */}
      <p className="counter">
        Pregunta {currentIndex + 1} de {totalQuestions}
      </p>
      <p className="remaining">Preguntas restantes: {remaining}</p>

      {/* Contenedor de la pregunta actual */}
      <div className="question-container">
        <label className="questionLabel">{currentQuestion.label}</label>

        {["text", "email", "number"].includes(currentQuestion.type) && (
          <input
            type={currentQuestion.type}
            name={String(currentQuestion.name)}
            placeholder={currentQuestion.placeholder || ""}
            value={formData[currentQuestion.name]}
            onChange={handleChange}
            className="input"
          />
        )}

        {currentQuestion.type === "select" && currentQuestion.options && (
          <select
            name={String(currentQuestion.name)}
            value={formData[currentQuestion.name]}
            onChange={handleChange}
            className="select"
          >
            <option value="">Selecciona una opción</option>
            {currentQuestion.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {currentQuestion.type === "radio" && currentQuestion.options && (
          <div className="radioGroup">
            {currentQuestion.options.map((opt) => (
              <label key={opt} className="radioLabel">
                <input
                  type="radio"
                  name={String(currentQuestion.name)}
                  value={opt}
                  checked={formData[currentQuestion.name] === opt}
                  onChange={handleChange}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === "checkbox" && currentQuestion.options && (
          <div className="checkboxGroup">
            {currentQuestion.options.map((opt) => (
              <label key={opt} className="checkboxLabel">
                <input
                  type="checkbox"
                  name={String(currentQuestion.name)}
                  value={opt}
                  checked={formData[currentQuestion.name]?.includes(opt)}
                  onChange={handleChange}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* Error si no pasó validación */}
        {error && <p className="error">{error}</p>}
      </div>

      {/* Botones de navegación */}
      <div className="buttonRow">
        {currentIndex > 0 && (
          <button type="button" onClick={handleBack} className="navButton">
            Atrás
          </button>
        )}

        {currentIndex < totalQuestions - 1 ? (
          <button type="button" onClick={handleNext} className="navButton">
            Siguiente
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} className="submitButton">
            Enviar
          </button>
        )}
      </div>

      {/* Estilos con styled-jsx */}
      <style jsx>{`
        .form-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: #f4f4f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          font-family: sans-serif;
          display: flex;
          flex-direction: column;
        }
        .progressContainer {
          width: 100%;
          height: 8px;
          background-color: #e0e0e0;
          margin-bottom: 1rem;
          border-radius: 4px;
          overflow: hidden;
        }
        .progressBar {
          width: 0;
          height: 100%;
          background-color: #5a67d8;
          transition: width 0.3s ease;
        }
        .counter {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .remaining {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 1rem;
        }
        .question-container {
          margin: 1rem 0;
        }
        .questionLabel {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .input,
        .select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 1rem;
          box-sizing: border-box;
        }
        .radioGroup,
        .checkboxGroup {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .radioLabel,
        .checkboxLabel {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .error {
          color: red;
          font-size: 0.9rem;
          margin-top: -0.5rem;
          margin-bottom: 1rem;
        }
        .buttonRow {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .navButton,
        .submitButton {
          padding: 0.5rem 1rem;
          background-color: #5a67d8;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .navButton:hover,
        .submitButton:hover {
          background-color: #434190;
        }
      `}</style>
    </div>
  );
}
