// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { NextResponse } from 'next/server';

// // Create an OpenAI API client (that's edge friendly!)
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY4,
// });

//   //export const dynamic = 'force-dynamic';
//   export const runtime = 'edge';

// export async function POST(req: Request) {
//     try {
    
//       const prompt = "Create a list of three questions for engaging with a person as a single string. Each question must be seperated by '||'. These question are for anonmymous social messaging platform. Avoid personal or sensitive topics focusing on friendly interaction. For example question should be like this: 'What's a hobby you recently started?' || 'If you could have dinner with a famous celebrity who would it be?' || 'Whats your goToSnack now a days?', Ensure the questions are intriguing,foster curiosity and contribute to a positive and welcoming environment."
      
//       const response = await openai.completions.create({
//       model:'gpt-3.5-turbo-instruct',
//       max_tokens: 400,
//       stream: true,
//       prompt,
//     });
  
    
//       const stream = OpenAIStream(response);

//       return new StreamingTextResponse(stream);

//     } catch (error) {
//         if(error instanceof OpenAI.APIError){
//             const {name,status,headers,message} = error
//             return NextResponse.json({
//               name,status,headers,message
//             },{status})
//         }else{
//           console.error('Unexpected Error Occured',error)
//           throw error
//         }
//     }
// }


import { OpenAI } from "openai";
import { NextResponse } from "next/server";

//USE CASE

//1. User will click on suggest-message
//2. we will go to open ai with some prompts
//3. we will show the response on frontend

const openai = new OpenAI({     
  apiKey: process.env.OPENAI_API_KEY4,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const { choices } = chunk;
          if (choices && choices.length > 0) {
            const text = choices[0].delta?.content || "";
            controller.enqueue(text);
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // OpenAI API error handling
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
}