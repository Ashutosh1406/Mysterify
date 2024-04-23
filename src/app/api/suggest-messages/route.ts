import OpenAI, { OpenAIError } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: Request) {
    try {
    
      const prompt = "Create a list of three questions for engaging with a person as a single string. Each question must be seperated by '||'. These question are for anonmymous social messaging platform. Avoid personal or sensitive topics focusing on friendly interaction. For example question should be like this: 'What's a hobby you recently started?' || 'If you could have dinner with a famous celebrity who would it be?' || 'Whats your goToSnack now a days?', Ensure the questions are intriguing,foster curiosity and contribute to a positive and welcoming environment."
      
      const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      max_tokens: 400,
      stream: true,
      prompt,
    });
  
    
      const stream = OpenAIStream(response);

      return new StreamingTextResponse(stream);

    } catch (error) {
        if(error instanceof OpenAI.APIError){
            const {name,status,headers,message} = error
            return NextResponse.json({
              name,status,headers,message
            },{status})
        }else{
          console.error('Unexpected Error Occured',error)
          throw error
        }
    }
}