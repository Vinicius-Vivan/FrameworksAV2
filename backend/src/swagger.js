import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Frameworks Modernos - API Express",
    version: "1.0.0",
    description: "Documentacao da API do backend (avaliacao 2) com CRUD de itens e autenticacao Supabase."
  },
  servers: [
    { url: "http://localhost:4000", description: "Desenvolvimento local" }
  ],
  tags: [
    {
      name: "Items",
      description: "Operacoes de CRUD do recurso principal"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token de acesso do Supabase (session.access_token)."
      }
    },
    schemas: {
      ItemInput: {
        type: "object",
        properties: {
          title: { type: "string", example: "Novo item" },
          description: { type: "string", example: "Detalhes sobre o item" },
          status: {
            type: "string",
            enum: ["pendente", "em_andamento", "concluido"],
            example: "pendente"
          }
        },
        required: ["title"]
      },
      Item: {
        allOf: [
          { $ref: "#/components/schemas/ItemInput" },
          {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              user_id: { type: "string", format: "uuid" },
              created_at: { type: "string", format: "date-time" }
            }
          }
        ]
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);
