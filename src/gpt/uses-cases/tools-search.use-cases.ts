import OpenAI from 'openai';

interface Options {
  prompt: string;
}

interface Tool {
  id: string;
}

async function toolsQuery(id) {
  try {
    const response = await fetch(`http://localhost:4000/tools/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const tool = await response.json();
    console.log('La herramienta es', tool);
  } catch (error) {
    console.error('Error in the request:', error);
    throw error; // Rethrow the error for further handling
  }
}

async function toolsKeyword(keywords: string) {
  try {
    const response = await fetch(`http://localhost:4000/tools/keyword-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(keywords),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const toolSearchResult = await response.json();
    console.log('Estas son las herramientas que encontré:', toolSearchResult);
  } catch (error) {
    console.error('Error in the request:', error);
    throw error; // Rethrow the error for further handling
  }
}

export const toolsSearchUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
                Eres un asistente para consultas sobre las herramientas de Airon Tools
                `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    functions: [
      {
        name: 'toolsQuery',
        description: 'Performs a query for a tool given a id.',
        parameters: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description:
                'Search for a tool by its id and you have to return the tool name the name of the tool is: name',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'toolsKeyword',
        description: 'Method that performs queries based on keywords.',
        parameters: {
          type: 'object',
          properties: {
            keywords: {
              type: 'string',
              description: `The keywords will be a text string, so if you request a query with multiple keywords, you will only receive and send the ones you need.
                            E.g. I want you to query me for all tools that are precision home and heavy duty electric drills; you will only return the keywords in a space separated string and the keyword will be 'heavy duty home electric drills'.
                            Important: and all of them will be returned to me in Spanish.
                            `,
            },
          },
          required: ['keywords'],
        },
      },
    ],
    function_call: 'auto',
    model: 'gpt-3.5-turbo',
    temperature: 0,
    max_tokens: 200,
  });

  const query = response.choices[0].message;

  if (!query.content) {
    const functionCallName = query.function_call.name;
    console.log(`Función llamada ${functionCallName}`);

    if (functionCallName === 'toolsQuery') {
      const tool: Tool = JSON.parse(query.function_call.arguments);
      // console.log(tool.id);
      toolsQuery(tool.id);
    }

    if (functionCallName === 'toolsKeyword') {
      const keywords = JSON.parse(query.function_call.arguments);
      // console.log(keywords);
      toolsKeyword(keywords);
    }
  }
};
