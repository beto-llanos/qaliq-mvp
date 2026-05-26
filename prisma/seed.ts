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
  mustText?: string;
  children?: Sub[];
};

type Chapter = {
  number: string;
  title: string;
  description?: string;
  children: Sub[];
};

const ISO_9001: Chapter[] = [
  {
    number: "4",
    title: "Contexto de la organización",
    children: [
      {
        number: "4.1",
        title: "Comprensión de la organización y su contexto",
        mustText:
          "La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y su dirección estratégica.",
      },
      {
        number: "4.2",
        title: "Comprensión de las necesidades y expectativas de las partes interesadas",
      },
      {
        number: "4.3",
        title: "Determinación del alcance del sistema de gestión de la calidad",
      },
      {
        number: "4.4",
        title: "Sistema de gestión de la calidad y sus procesos",
        children: [
          { number: "4.4.1", title: "Procesos necesarios y sus interacciones" },
          { number: "4.4.2", title: "Información documentada" },
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
