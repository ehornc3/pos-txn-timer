import type { H3Event } from 'h3'

export default eventHandler(async (event: H3Event) => {
  const prisma = event.context.prisma

  const example = await prisma.record.findMany()
  if (!example) {
    throw createError({ statusCode: 500, statusMessage: `Something blew up` })
  }

  return example
})
