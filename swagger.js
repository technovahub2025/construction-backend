const createSwaggerSpec = (baseUrl) => ({
  openapi: "3.0.3",
  info: {
    title: "Construction Backend API",
    version: "1.0.0",
    description: "Swagger documentation for the construction backend.",
  },
  servers: [
    {
      url: baseUrl,
      description: "Current server",
    },
  ],
  tags: [
    { name: "Auth", description: "Login endpoints" },
    { name: "Project", description: "Project management" },
    { name: "Labour", description: "Labour report endpoints" },
    { name: "Material", description: "Material report endpoints" },
    { name: "Measurement", description: "Measurement report endpoints" },
    { name: "Workflow", description: "Workflow preview and submit" },
    { name: "Issue", description: "Client issue endpoints" },
  ],
  paths: {
    "/api/projectengineerlogin": {
      post: {
        tags: ["Auth"],
        summary: "Project engineer login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectEngineerLogin" },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          400: { description: "Validation error" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/siteadminlogin": {
      post: {
        tags: ["Auth"],
        summary: "Site engineer login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SiteEngineerLogin" },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          400: { description: "Validation error" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/createproject": {
      post: {
        tags: ["Project"],
        summary: "Create a project",
        responses: { 200: { description: "Project created" } },
      },
    },
    "/api/updateproject/{id}": {
      put: {
        tags: ["Project"],
        summary: "Update a project",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Project updated" } },
      },
    },
    "/api/viewproject": {
      get: {
        tags: ["Project"],
        summary: "View a project with related labour, material, measurement, and issues",
        parameters: [
          {
            name: "projectType",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Project type to search for",
          },
          {
            name: "siteEngineer",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Site engineer name to search for",
          },
        ],
        responses: { 200: { description: "Combined project details" } },
      },
    },
    "/api/workflowpreview": {
      get: {
        tags: ["Workflow"],
        summary: "Preview workflow data",
        responses: { 200: { description: "Workflow preview" } },
      },
    },
    "/api/submitworkflow": {
      put: {
        tags: ["Workflow"],
        summary: "Update overall project status",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["projectId", "siteEngineer", "status"],
                properties: {
                  projectId: { type: "string" },
                  siteEngineer: { type: "string" },
                  status: {
                    type: "string",
                    enum: ["pending", "inprogress", "hold", "completed"],
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Workflow status updated" } },
      },
    },
    "/api/submitissue": {
      post: {
        tags: ["Issue"],
        summary: "Submit client issue",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClientIssue" },
            },
          },
        },
        responses: {
          201: { description: "Issue submitted" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/getissue": {
      get: {
        tags: ["Issue"],
        summary: "List client issues",
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Filter issues by project ID",
          },
          {
            name: "siteEngineer",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Optional filter by site engineer name",
          },
        ],
        responses: { 200: { description: "Issue list" } },
      },
    },
  },
  components: {
    schemas: {
      ProjectEngineerLogin: {
        type: "object",
        required: ["phone", "password"],
        properties: {
          phone: { type: "string", example: "9876543210" },
          password: { type: "string", example: "123456" },
        },
      },
      SiteEngineerLogin: {
        type: "object",
        required: ["name", "password"],
        properties: {
          name: { type: "string", example: "Raj" },
          password: { type: "string", example: "site@2026" },
        },
      },
      ClientIssue: {
        type: "object",
        required: ["projectId", "siteEngineer", "issueText"],
        properties: {
          projectId: {
            type: "string",
            example: "665f4c2b1f2a4d2c9f7e1234",
          },
          siteEngineer: {
            type: "string",
            example: "Raj",
          },
          issueText: {
            type: "string",
            example: "Water leakage in the west wall",
          },
          images: {
            type: "array",
            items: {
              type: "string",
              example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA",
            },
            example: [
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA",
              "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD",
            ],
          },
        },
      },
    },
  },
});

const swaggerHtml = () => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Construction Backend API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #f6f7fb; font-family: Arial, sans-serif; }
      .topbar { display: none; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/api-docs.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
        layout: "BaseLayout"
      });
    </script>
  </body>
</html>
`;

module.exports = {
  createSwaggerSpec,
  swaggerHtml,
};
