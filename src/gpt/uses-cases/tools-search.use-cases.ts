import OpenAI from 'openai'

interface Options {
    prompt: string;
}

interface Tool {
    id: string;
}

async function toolsQuery( id ) {
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

export const toolsSearchUseCase = async( openai: OpenAI, {prompt}: Options ) => {
    const response = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                Eres un asistente para consultas sobre las herramientas de Airon Tools
                `,
            },
            {
                role: 'user',
                content: prompt,
            }
        ],
        functions: [
            {
                name: 'toolsQuery',
                description: 'Performs a query for a tool given a id.',
                parameters: {
                    type: 'object',
                    properties: {
                        id: {
                            type:'number',
                            description: 'Search for a tool by its id and you have to return the tool name the name of the tool is: name',
                        }
                    },
                    required: ['id'],
                }
            }
        ],
        function_call: "auto",
        model: "gpt-3.5-turbo",
        temperature: 0,
        max_tokens: 200,
    });
    
    const query = response.choices[0].message;

    if(!query.content) {
        const functionCallName = query.function_call.name;
        console.log(`Función llamada ${functionCallName}`);

        if(functionCallName === 'toolsQuery') {
            const tool: Tool = JSON.parse(query.function_call.arguments);
            console.log(tool.id);
            toolsQuery(tool.id);
        }
    }
}