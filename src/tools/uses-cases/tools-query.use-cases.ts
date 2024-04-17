import OpenAI from 'openai'

interface Options {
    prompt: string;
}

interface Tool {
    id: number;
}

export const searchToolUseCase = async( openai: OpenAI, {prompt}: Options, myToolsFunction) => {
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
                name: 'myToolsFunction',
                description: 'Performs a query for a tool given a toolId.',
                parameters: {
                    type: 'object',
                    properties: {
                        toolId: {
                            type:'number',
                            description: 'Search for a tool by its toolId and you have to return the tool name the name of the tool is: name',
                        }
                    },
                    required: ['toolId'],
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

        if(functionCallName === 'myToolsFunction') {
            const tool: Tool = JSON.parse(query.function_call.arguments);
            console.log(tool.id);
            myToolsFunction(tool.id);
        }
    }
}