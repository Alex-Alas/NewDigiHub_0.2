import { HttpError } from 'wasp/server'

export const getCompanyProfile = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  const company = await context.entities.Company.findUnique({
    where: { id: context.user.companyId },
    select: {
      id: true,
      name: true,
      industry: true,
      sector: true,
      location: true,
      contactInfo: true,
      score: true,
      level: true,
      achievements: true,
      employees: {
        select: {
          id: true,
          name: true,
          position: true
        }
      }
    }
  });
  if (!company) throw new HttpError(404, 'Company not found');
  return company;
}

export const getEmployeeProfile = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const employee = await context.entities.Employee.findUnique({
    where: { id: context.user.employeeId },
    select: {
      id: true,
      name: true,
      position: true,
      score: true,
      level: true,
      contactInfo: true,
      achievements: true,
      company: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  if (!employee) throw new HttpError(404, 'No employee profile found.');

  return employee;
}

export const getAvailableJourneys = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.Journey.findMany({});
}

export const getRankings = async ({ category }, context) => {
  if (!context.user) { throw new HttpError(401) }

  let rankings;
  switch (category) {
    case 'industry':
      rankings = await context.entities.Company.findMany({
        orderBy: { score: 'desc' },
        select: { id: true, name: true, industry: true, score: true }
      });
      break;
    case 'sector':
      rankings = await context.entities.Company.findMany({
        orderBy: { score: 'desc' },
        select: { id: true, name: true, sector: true, score: true }
      });
      break;
    case 'department':
      rankings = await context.entities.Employee.findMany({
        orderBy: { score: 'desc' },
        select: { id: true, name: true, position: true, score: true }
      });
      break;
    case 'city':
      rankings = await context.entities.Company.findMany({
        orderBy: { score: 'desc' },
        select: { id: true, name: true, location: true, score: true }
      });
      break;
    default: // 'all'
      rankings = await context.entities.Company.findMany({
        orderBy: { score: 'desc' },
        select: { id: true, name: true, score: true }
      });
  }

  return rankings;
}
