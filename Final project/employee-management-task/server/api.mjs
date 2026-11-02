import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const storePath = process.env.API_DATA_FILE ?? `${currentDirectory}/data/store.json`;
const employeeSeedPath = `${currentDirectory}/../public/data/employees.json`;
const statuses = ['Pending', 'In Progress', 'Completed'];
const priorities = ['Low', 'Medium', 'High'];

const employeeSeed = JSON.parse(await readFile(employeeSeedPath, 'utf8'));
const taskSeed = [
  { id: 1, title: 'Complete employee onboarding form', description: 'Prepare and review the onboarding paperwork for the new engineering cohort.', assignedEmployeeId: 1, priority: 'High', status: 'Pending', dueDate: '2026-11-05' },
  { id: 2, title: 'Review leave request policy', description: 'Check the current leave policy and share recommended updates with HR.', assignedEmployeeId: 2, priority: 'Medium', status: 'Pending', dueDate: '2026-11-08' },
  { id: 3, title: 'Prepare monthly team report', description: 'Collect team updates and prepare the monthly operations summary.', assignedEmployeeId: 4, priority: 'Low', status: 'Pending', dueDate: '2026-11-12' },
  { id: 4, title: 'Build employee directory', description: 'Implement a searchable directory with department and status filters.', assignedEmployeeId: 1, priority: 'High', status: 'In Progress', dueDate: '2026-11-10' },
  { id: 5, title: 'Update employee profiles', description: 'Review employee contact information and correct outdated profile details.', assignedEmployeeId: 5, priority: 'Medium', status: 'In Progress', dueDate: '2026-11-14' },
  { id: 6, title: 'Test attendance workflow', description: 'Verify the attendance workflow and report any defects.', assignedEmployeeId: 6, priority: 'High', status: 'In Progress', dueDate: '2026-11-06' },
  { id: 7, title: 'Publish holiday calendar', description: 'Publish the approved company holiday calendar for the coming year.', assignedEmployeeId: 2, priority: 'Low', status: 'Completed', dueDate: '2026-10-25' },
  { id: 8, title: 'Create department list', description: 'Confirm the department names used throughout the employee directory.', assignedEmployeeId: 3, priority: 'Low', status: 'Completed', dueDate: '2026-10-20' }
];

let data;
try {
  data = JSON.parse(await readFile(storePath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  data = { employees: employeeSeed, tasks: taskSeed };
}

function send(response, statusCode, value) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(value));
}

async function readBody(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) throw new Error('Request body is too large.');
  }
  return JSON.parse(body || '{}');
}

async function persist() {
  await mkdir(dirname(storePath), { recursive: true });
  await writeFile(storePath, `${JSON.stringify(data, null, 2)}\n`);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const path = url.pathname.split('/').filter(Boolean);

  try {
    if (path[0] !== 'api' || !['employees', 'tasks'].includes(path[1])) {
      send(response, 404, { message: 'Endpoint not found.' });
      return;
    }

    const collection = path[1];
    const records = data[collection];
    const id = path[2] ? Number(path[2]) : undefined;

    if (request.method === 'GET' && id === undefined) {
      send(response, 200, records);
      return;
    }

    if (request.method === 'GET' && Number.isInteger(id)) {
      const record = records.find((item) => item.id === id);
      send(response, record ? 200 : 404, record ?? { message: 'Record not found.' });
      return;
    }

    if (request.method === 'POST' && id === undefined) {
      const body = await readBody(request);
      const requiredFields = collection === 'employees'
        ? ['name', 'email', 'phone', 'department', 'role', 'joiningDate', 'status']
        : ['title', 'description', 'assignedEmployeeId', 'priority', 'status', 'dueDate'];
      const missingField = requiredFields.find((field) => body[field] === undefined || body[field] === '');

      if (missingField) {
        send(response, 400, { message: `${missingField} is required.` });
        return;
      }

      if (collection === 'employees' && !['Active', 'Inactive'].includes(body.status)) {
        send(response, 400, { message: 'Employee status is invalid.' });
        return;
      }

      if (collection === 'tasks') {
        if (!statuses.includes(body.status) || !priorities.includes(body.priority)) {
          send(response, 400, { message: 'Task status or priority is invalid.' });
          return;
        }
        if (!data.employees.some((employee) => employee.id === Number(body.assignedEmployeeId))) {
          send(response, 400, { message: 'Assigned employee was not found.' });
          return;
        }
      }

      const record = { ...body, id: Math.max(0, ...records.map((item) => item.id)) + 1 };
      records.push(record);
      await persist();
      send(response, 201, record);
      return;
    }

    send(response, 405, { message: 'Method not allowed.' });
  } catch (error) {
    const statusCode = error instanceof SyntaxError ? 400 : 500;
    send(response, statusCode, { message: statusCode === 400 ? 'Request body must be valid JSON.' : 'The API request could not be completed.' });
  }
});

const port = Number(process.env.API_PORT ?? 3001);
server.listen(port, '127.0.0.1', () => {
  console.log(`Employee API listening at http://127.0.0.1:${port}`);
});
