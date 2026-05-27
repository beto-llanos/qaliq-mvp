// ─────────────────────────────────────────────────────────────────────────────
// Seed: ISO 9001:2015 catalog (chapters 4-10, subchapters, key clauses)
//
// This is the global catalog shared by all tenants. The full "debes" text
// will be curated over time; the structure below covers the entire normative
// hierarchy referenced in audits.
//
// Run with: npm run db:seed
// Idempotent: re-running updates titles/descriptions without duplicating rows.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type Sub = {
  number: string;
  title: string;
  description?: string;
  guidance?: string;
  mustText?: string;
  children?: Sub[];
};

type Chapter = {
  number: string;
  title: string;
  description?: string;
  guidance?: string;
  children: Sub[];
};

const ISO_9001: Chapter[] = [
  {
    number: "4",
    title: "Contexto de la organización",
    description:
      "El SGC arranca entendiendo dónde opera la organización: qué la afecta desde afuera, qué pasa adentro, quiénes son sus partes interesadas y hasta dónde va a llegar el sistema. Define el alcance y los procesos antes de pasar a liderazgo y planificación.",
    children: [
      {
        number: "4.1",
        title: "Comprensión de la organización y su contexto",
        description:
          "Identifica los factores externos (legales, tecnológicos, competencia, mercado, sociedad, economía) e internos (valores, cultura, conocimientos, desempeño) que afectan la capacidad del SGC de lograr sus resultados. Mantén el análisis bajo seguimiento y revisión.",
        guidance:
          "Herramientas usuales: FODA / CAME, PESTEL, Matriz de Perfil Competitivo (MPC), Cadena de Valor, Diagnóstico Interno. Integra los resultados a la misión, visión, manual de calidad y mapa de procesos. El auditor pedirá: documento de análisis del contexto, evidencia de cómo se administran los asuntos relevantes a través del SGC, y minutas de revisión periódica del contexto.",
        mustText:
          "La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y su dirección estratégica, y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión de la calidad. La organización debe realizar el seguimiento y la revisión de la información sobre estas cuestiones externas e internas.",
      },
      {
        number: "4.2",
        title: "Comprensión de las necesidades y expectativas de las partes interesadas",
        description:
          "Identifica las partes interesadas relevantes para el SGC (clientes, accionistas, personal, proveedores, sindicatos, reguladores, sociedad) y los requisitos pertinentes de cada una. Lleva seguimiento y revisión de esa información.",
        guidance:
          "El auditor pedirá un documento con: lista de partes interesadas, sus requisitos, cómo se atienden y el estatus de cumplimiento. Acompañado de reuniones documentadas (minutas, listas de asistencia) donde se revise periódicamente la información de cada parte interesada.",
        mustText:
          "Debido a su efecto o efecto potencial en la capacidad de la organización de proporcionar regularmente productos y servicios que satisfagan los requisitos del cliente y los legales y reglamentarios aplicables, la organización debe determinar: a) las partes interesadas que son pertinentes al sistema de gestión de la calidad; b) los requisitos pertinentes de estas partes interesadas para el sistema de gestión de la calidad. La organización debe realizar el seguimiento y la revisión de la información sobre estas partes interesadas y sus requisitos pertinentes.",
      },
      {
        number: "4.3",
        title: "Determinación del alcance del sistema de gestión de la calidad",
        description:
          "Define los límites y la aplicabilidad del SGC: qué productos y servicios cubre, qué sedes/áreas incluye, y qué requisitos de la norma son aplicables o no (con justificación). El alcance debe mantenerse como información documentada.",
        guidance:
          "Normalmente vive en el Manual del SGC. El auditor validará: que el alcance esté disponible y documentado, que las exclusiones tengan justificación válida, y que coincidan con las operaciones reales. No se puede declarar conformidad con ISO 9001 si las exclusiones afectan la conformidad del producto/servicio o la satisfacción del cliente.",
        mustText:
          "La organización debe determinar los límites y la aplicabilidad del sistema de gestión de la calidad para establecer su alcance. Cuando se determina este alcance, la organización debe considerar: a) las cuestiones externas e internas indicadas en el apartado 4.1; b) los requisitos de las partes interesadas pertinentes indicados en el apartado 4.2; c) los productos y servicios de la organización. La organización debe aplicar todos los requisitos de esta Norma Internacional si son aplicables en el alcance determinado de su sistema de gestión de la calidad. El alcance del sistema de gestión de la calidad de la organización debe estar disponible y mantenerse como información documentada. El alcance debe establecer los tipos de productos y servicios cubiertos, y proporcionar la justificación para cualquier requisito de esta Norma Internacional que la organización determine que no es aplicable para el alcance de su sistema de gestión de la calidad.",
      },
      {
        number: "4.4",
        title: "Sistema de gestión de la calidad y sus procesos",
        description:
          "Establece, implementa, mantiene y mejora continuamente un SGC basado en procesos. Identifica los procesos necesarios, sus entradas, salidas, secuencia, recursos, responsables, riesgos y métricas. Mantén y conserva la información documentada que soporta y evidencia los procesos.",
        children: [
          {
            number: "4.4.1",
            title: "Procesos necesarios y sus interacciones",
            description:
              "Identifica los procesos del SGC y para cada uno define: entradas y salidas, secuencia e interacción, criterios y métodos de control (incluidos indicadores y mediciones), recursos, responsables y autoridades, riesgos y oportunidades, criterios de evaluación y oportunidades de mejora.",
            guidance:
              "Mínimo a tener listo para auditoría: mapa de procesos, procedimientos por proceso, organigrama con responsables, tablero de indicadores (KPIs) con resultados y acciones, documento de gestión de riesgos y oportunidades, y gestión de satisfacción del cliente. El auditor verificará que los procesos están realmente operando con esos controles, no solo en papel.",
            mustText:
              "La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de la calidad, incluidos los procesos necesarios y sus interacciones, de acuerdo con los requisitos de esta Norma Internacional. La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: a) determinar las entradas requeridas y las salidas esperadas de estos procesos; b) determinar la secuencia e interacción de estos procesos; c) determinar y aplicar los criterios y los métodos (incluyendo el seguimiento, las mediciones y los indicadores del desempeño relacionados) necesarios para asegurarse de la operación eficaz y el control de estos procesos; d) determinar los recursos necesarios para estos procesos y asegurarse de su disponibilidad; e) asignar las responsabilidades y autoridades para estos procesos; f) abordar los riesgos y oportunidades determinados de acuerdo con los requisitos del apartado 6.1; g) evaluar estos procesos e implementar cualquier cambio necesario para asegurarse de que estos procesos logran los resultados previstos; h) mejorar los procesos y el sistema de gestión de la calidad.",
          },
          {
            number: "4.4.2",
            title: "Información documentada",
            description:
              "Mantén la información documentada que soporta la operación de los procesos (documentos vivos: manuales, procedimientos, instructivos) y conserva la que demuestra que los procesos se realizan según lo planificado (registros: bitácoras, resultados, evidencias).",
            guidance:
              "Mantener ≠ Conservar. Mantener = documentos para operar (procedimientos, instructivos, manuales). Conservar = registros para demostrar cumplimiento (bitácoras, formatos llenos, evidencias firmadas). El auditor revisará procedimientos, instructivos, documentos y registros que evidencien cada proceso definido para el SGC.",
            mustText:
              "En la medida en que sea necesario, la organización debe: a) mantener información documentada para apoyar la operación de sus procesos; b) conservar la información documentada para tener la confianza de que los procesos se realizan según lo planificado.",
          },
        ],
      },
    ],
  },
  {
    number: "5",
    title: "Liderazgo",
    children: [
      {
        number: "5.1",
        title: "Liderazgo y compromiso",
        children: [
          { number: "5.1.1", title: "Generalidades" },
          { number: "5.1.2", title: "Enfoque al cliente" },
        ],
      },
      {
        number: "5.2",
        title: "Política",
        children: [
          { number: "5.2.1", title: "Establecimiento de la política de la calidad" },
          { number: "5.2.2", title: "Comunicación de la política de la calidad" },
        ],
      },
      { number: "5.3", title: "Roles, responsabilidades y autoridades en la organización" },
    ],
  },
  {
    number: "6",
    title: "Planificación",
    children: [
      {
        number: "6.1",
        title: "Acciones para abordar riesgos y oportunidades",
        children: [
          { number: "6.1.1", title: "Determinación de riesgos y oportunidades" },
          { number: "6.1.2", title: "Planificación de acciones" },
        ],
      },
      {
        number: "6.2",
        title: "Objetivos de la calidad y planificación para lograrlos",
        children: [
          { number: "6.2.1", title: "Establecimiento de objetivos" },
          { number: "6.2.2", title: "Planificación para lograr objetivos" },
        ],
      },
      { number: "6.3", title: "Planificación de los cambios" },
    ],
  },
  {
    number: "7",
    title: "Apoyo",
    children: [
      {
        number: "7.1",
        title: "Recursos",
        children: [
          { number: "7.1.1", title: "Generalidades" },
          { number: "7.1.2", title: "Personas" },
          { number: "7.1.3", title: "Infraestructura" },
          { number: "7.1.4", title: "Ambiente para la operación de los procesos" },
          { number: "7.1.5", title: "Recursos de seguimiento y medición" },
          { number: "7.1.6", title: "Conocimientos de la organización" },
        ],
      },
      { number: "7.2", title: "Competencia" },
      { number: "7.3", title: "Toma de conciencia" },
      { number: "7.4", title: "Comunicación" },
      {
        number: "7.5",
        title: "Información documentada",
        children: [
          { number: "7.5.1", title: "Generalidades" },
          { number: "7.5.2", title: "Creación y actualización" },
          { number: "7.5.3", title: "Control de la información documentada" },
        ],
      },
    ],
  },
  {
    number: "8",
    title: "Operación",
    children: [
      { number: "8.1", title: "Planificación y control operacional" },
      {
        number: "8.2",
        title: "Requisitos para los productos y servicios",
        children: [
          { number: "8.2.1", title: "Comunicación con el cliente" },
          { number: "8.2.2", title: "Determinación de los requisitos" },
          { number: "8.2.3", title: "Revisión de los requisitos" },
          { number: "8.2.4", title: "Cambios en los requisitos" },
        ],
      },
      {
        number: "8.3",
        title: "Diseño y desarrollo de los productos y servicios",
        children: [
          { number: "8.3.1", title: "Generalidades" },
          { number: "8.3.2", title: "Planificación del diseño y desarrollo" },
          { number: "8.3.3", title: "Entradas para el diseño y desarrollo" },
          { number: "8.3.4", title: "Controles del diseño y desarrollo" },
          { number: "8.3.5", title: "Salidas del diseño y desarrollo" },
          { number: "8.3.6", title: "Cambios del diseño y desarrollo" },
        ],
      },
      {
        number: "8.4",
        title: "Control de los procesos, productos y servicios suministrados externamente",
        children: [
          { number: "8.4.1", title: "Generalidades" },
          { number: "8.4.2", title: "Tipo y alcance del control" },
          { number: "8.4.3", title: "Información para los proveedores externos" },
        ],
      },
      {
        number: "8.5",
        title: "Producción y provisión del servicio",
        children: [
          { number: "8.5.1", title: "Control de la producción y de la provisión del servicio" },
          { number: "8.5.2", title: "Identificación y trazabilidad" },
          { number: "8.5.3", title: "Propiedad perteneciente a los clientes o proveedores externos" },
          { number: "8.5.4", title: "Preservación" },
          { number: "8.5.5", title: "Actividades posteriores a la entrega" },
          { number: "8.5.6", title: "Control de los cambios" },
        ],
      },
      { number: "8.6", title: "Liberación de los productos y servicios" },
      { number: "8.7", title: "Control de las salidas no conformes" },
    ],
  },
  {
    number: "9",
    title: "Evaluación del desempeño",
    children: [
      {
        number: "9.1",
        title: "Seguimiento, medición, análisis y evaluación",
        children: [
          { number: "9.1.1", title: "Generalidades" },
          { number: "9.1.2", title: "Satisfacción del cliente" },
          { number: "9.1.3", title: "Análisis y evaluación" },
        ],
      },
      { number: "9.2", title: "Auditoría interna" },
      { number: "9.3", title: "Revisión por la dirección" },
    ],
  },
  {
    number: "10",
    title: "Mejora",
    children: [
      { number: "10.1", title: "Generalidades" },
      { number: "10.2", title: "No conformidad y acción correctiva" },
      { number: "10.3", title: "Mejora continua" },
    ],
  },
];

async function upsertClauseTree(
  standardId: string,
  parentId: string | null,
  subs: Sub[],
  order: number
) {
  for (let i = 0; i < subs.length; i++) {
    const node = subs[i];
    const existing = await db.isoClause.findFirst({
      where: { standardId, number: node.number },
    });
    const isLeaf = !node.children || node.children.length === 0;
    const data = {
      standardId,
      parentId,
      number: node.number,
      title: node.title,
      description: node.description ?? null,
      guidance: node.guidance ?? null,
      isMust: isLeaf,
      mustText: node.mustText ?? null,
      order: order * 1000 + i,
    };
    const saved = existing
      ? await db.isoClause.update({ where: { id: existing.id }, data })
      : await db.isoClause.create({ data });

    if (node.children?.length) {
      await upsertClauseTree(standardId, saved.id, node.children, order + 1);
    }
  }
}

async function main() {
  const standard = await db.isoStandard.upsert({
    where: { code: "ISO-9001" },
    update: { name: "ISO 9001:2015", version: "2015", active: true },
    create: {
      code: "ISO-9001",
      name: "ISO 9001:2015",
      version: "2015",
      active: true,
    },
  });

  console.log(`Standard upserted: ${standard.code}`);

  for (let i = 0; i < ISO_9001.length; i++) {
    const chapter = ISO_9001[i];
    const existing = await db.isoClause.findFirst({
      where: { standardId: standard.id, number: chapter.number },
    });
    const data = {
      standardId: standard.id,
      parentId: null,
      number: chapter.number,
      title: chapter.title,
      description: chapter.description ?? null,
      guidance: chapter.guidance ?? null,
      isMust: false,
      order: i,
    };
    const saved = existing
      ? await db.isoClause.update({ where: { id: existing.id }, data })
      : await db.isoClause.create({ data });
    await upsertClauseTree(standard.id, saved.id, chapter.children, i + 1);
    console.log(`  Chapter ${chapter.number} loaded`);
  }

  const count = await db.isoClause.count({ where: { standardId: standard.id } });
  console.log(`Done. ${count} clauses in catalog.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
