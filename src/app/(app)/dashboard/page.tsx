// 'use client';

// import  MessageCard  from '@/components/MessageCard';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import { Switch } from '@/components/ui/switch';
// import { useToast } from '@/components/ui/use-toast';
// import { Message } from '@/model/User';
// import { ApiResponse } from '@/types/ApiResponse';
// import { zodResolver } from '@hookform/resolvers/zod';
// import axios, { AxiosError } from 'axios';
// import { Loader2, RefreshCcw } from 'lucide-react';
// import { User } from 'next-auth';
// import { useSession } from 'next-auth/react';
// import React, { useCallback, useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';

// function UserDashboard() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSwitchLoading, setIsSwitchLoading] = useState(false);

//   const { toast } = useToast();

//   const handleDeleteMessage = (messageId: string) => {
//     setMessages(messages.filter((message) => message._id !== messageId));
//   };

//   const { data: session } = useSession();

//   const form = useForm({
//     resolver: zodResolver(acceptMessageSchema),
//   });

//   const { register, watch, setValue } = form;
//   const acceptMessages = watch('acceptMessages');

//   const fetchAcceptMessages = useCallback(async () => {
//     setIsSwitchLoading(true);
//     try {
//       const response = await axios.get<ApiResponse>('/api/accept-messages');
//       setValue('acceptMessages', response.data.isAcceptingMessage);
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast({
//         title: 'Error',
//         description:
//           axiosError.response?.data.message ??
//           'Failed to fetch message settings',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSwitchLoading(false);
//     }
//   }, [setValue, toast]);

//   const fetchMessages = useCallback(
//     async (refresh: boolean = false) => {
//       setIsLoading(true);
//       setIsSwitchLoading(false);
//       try {
//         const response = await axios.get<ApiResponse>('/api/get-messages');
        
//         // setMessages(response.data.messages || []);

//         if(response.status === 201){
//           setMessages([]);
//           toast({
//             title: 'No Messages in inbox',
//             description: 'No messages to display at the moment.',
//           });
//         }
//         else{
//             setMessages(response.data.messages || [])
//             if (refresh) {
//               toast({
//                 title: 'Refreshed Messages',
//                 description: 'Showing latest messages',
//               });
//             }
//         }
//       } catch (error) {
//         const axiosError = error as AxiosError<ApiResponse>;
//         toast({
//           title: 'Error',
//           description:
//             axiosError.response?.data.message ?? 'Failed to fetch messages',
//           variant: 'destructive',
//         });
//       } finally {
//         setIsLoading(false);
//         setIsSwitchLoading(false);
//       }
//     },
//     [setIsLoading, setMessages, toast]);


//   // Fetch initial state from the server
//   useEffect(() => {
//     if (!session || !session.user) return;

//     fetchMessages();

//     fetchAcceptMessages();
//   }, [session, setValue, fetchAcceptMessages, fetchMessages]);

//   // Handle switch change
//   const handleSwitchChange = async () => {
//     try {
//       const response = await axios.post<ApiResponse>('/api/accept-messages', {
//         acceptMessages: !acceptMessages,
//       });
//       setValue('acceptMessages', !acceptMessages);
//       toast({
//         title: response.data.message,
//         variant: 'default',
//       });
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast({
//         title: 'Error',
//         description:
//           axiosError.response?.data.message ??
//           'Failed to update message settings',
//         variant: 'destructive',
//       });
//     }
//   };

//   if (!session || !session.user) {
//     return <div></div>;
//   }

//   const { username } = session.user as User;

//   const baseUrl = `${window.location.protocol}//${window.location.host}`;
//   const profileUrl = `${baseUrl}/u/${username}`;

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(profileUrl);
//     toast({
//       title: 'URL Copied!',
//       description: 'Profile URL has been copied to clipboard.',
//     });
//   };

//   const handleDeleteAllMessages = async () => {
//     try {
//       const response = await axios.delete('/api/delete-all-messages');
//       if (response.status === 200) {
//         toast({
//           title: 'Success',
//           description: response.data.message,
//         });
//         setMessages([]); // Clear messages from the state
//       } else {
//         toast({
//           title: 'Error',
//           description: response.data.message,
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast({
//         title: 'Error',
//         description:
//           axiosError.response?.data.message ?? 'Failed to delete messages',
//         variant: 'destructive',
//       });
//     }
//   };
  
// return (
//   <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
//     <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

//     <div className="mb-4">
//       <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
//       <div className="flex items-center">
//         <input
//           type="text"
//           value={profileUrl}
//           disabled
//           className="input input-bordered w-full p-2 mr-2"
//         />
//         <Button onClick={copyToClipboard}>Copy</Button>
//       </div>
//     </div>

//     <div className="mb-4">
//       <Switch
//         {...register('acceptMessages')}
//         checked={acceptMessages}
//         onCheckedChange={handleSwitchChange}
//         disabled={isSwitchLoading}
//       />
//       {/* <span className="ml-2">
//         Accept Messages: {acceptMessages ? 'On' : 'Off'}
//       </span> */}
//     </div>

//     <div className="flex items-center justify-between mb-4">
//       <Button
//         variant="outline"
//         onClick={(e) => {
//           e.preventDefault();
//           fetchMessages(true);
//         }}
//       >
//         {isLoading ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : (
//           <RefreshCcw className="h-4 w-4" />
//         )}
//       </Button>
//       <Button
//         variant="destructive"
//         onClick={handleDeleteAllMessages}
//       >
//         Delete All Messages
//       </Button>
//     </div>

//     <Separator />

//     <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//       {messages.length > 0 ? (
//         messages.map((message) => (
//           <MessageCard
//             key={message._id}
//             message={message}
//             onMessageDelete={handleDeleteMessage}
//           />
//         ))
//       ) : (
//         <p>No messages to display.</p>
//       )}
//     </div>
//   </div>
// );
// }

// export default UserDashboard;

// Change 1.2  (fixed Hydration Error OF Switch Status)

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import MessageCard from '@/components/MessageCard';
import { User } from 'next-auth';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [acceptMessages, setAcceptMessages] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();
  const { data: session } = useSession();

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      const serverValue = response.data.isAcceptingMessage; // field name from backend

      if (typeof serverValue === 'boolean') {
        setAcceptMessages(serverValue);
      } else {
        setAcceptMessages(false);
      }
    } catch (error) {
      setAcceptMessages(false); // fallback
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        if (response.status === 201) {
          setMessages([]);
          toast({
            title: 'No Messages in inbox',
            description: 'No messages to display at the moment.',
          });
        } else {
          setMessages(response.data.messages || []);
          if (refresh) {
            toast({
              title: 'Refreshed Messages',
              description: 'Showing latest messages',
            });
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const handleSwitchChange = async () => {
    if (acceptMessages === undefined) return;
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setAcceptMessages(!acceptMessages);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to update message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const handleDeleteAllMessages = async () => {
    try {
      const response = await axios.delete('/api/delete-all-messages');
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: response.data.message,
        });
        setMessages([]);
      } else {
        toast({
          title: 'Error',
          description: response.data.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete messages',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((m) => m._id !== messageId));
  };

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  if (!session?.user) return <div />;

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        {typeof acceptMessages !== 'boolean' ? (
          <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
        ) : (
          <Switch
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={() => fetchMessages(true)}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <Button variant="destructive" onClick={handleDeleteAllMessages}>
          Delete All Messages
        </Button>
      </div>

      <Separator />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;

