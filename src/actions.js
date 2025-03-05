import { HttpError } from 'wasp/server'

export const updateCompanyProfile = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const company = await context.entities.Company.findUnique({
    where: { id: args.companyId }
  });
  if (!company || !context.user.companyId || company.id !== context.user.companyId) { throw new HttpError(403) };

  return context.entities.Company.update({
    where: { id: args.companyId },
    data: {
      name: args.name,
      industry: args.industry,
      sector: args.sector,
      location: args.location,
      contactInfo: args.contactInfo,
      score: args.score,
      level: args.level,
      achievements: args.achievements
    }
  });
}

export const enrollInJourney = async ({ journeyId }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const employee = await context.entities.Employee.findUnique({
    where: { id: context.user.employeeId },
    include: { company: true }
  });

  const journey = await context.entities.Journey.findUnique({
    where: { id: journeyId },
    include: { company: true }
  });

  if (!journey || !employee || journey.companyId !== employee.companyId) {
    throw new HttpError(403);
  }

  await context.entities.Employee.update({
    where: { id: employee.id },
    data: { journeys: { connect: { id: journeyId } } }
  });

  return { message: 'Enrolled in journey successfully.' };
}

export const acquireJourney = async ({ journeyId }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const company = await context.entities.Company.findUnique({
    where: { id: context.user.companyId }
  });
  if (!company) { throw new HttpError(403) };

  const journey = await context.entities.Journey.findUnique({
    where: { id: journeyId }
  });
  if (!journey) { throw new HttpError(404, 'Journey not found') };

  // Logic to associate the journey with the company can be added here.
  // This might involve creating a new record in a join table or updating a field.
  
  return { success: true, message: 'Journey acquired successfully' };
}
