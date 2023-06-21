
"use client";

import type { OAuthCredential, UserCredential } from "firebase/auth";
import { loginGitHub, loginGoogle } from '@/utils/firebase';
import { useCallback, useState } from 'react';
import NoUserView from './NoUserView';
import LoggedUserView, { type LoginState } from './LoggedUserView';
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function Notification({ message }: { message: string | null }) {

    if (!message) return null;

    return (
        <div className='fixed top-24 right-4 z-50 flex items-center justify-center px-4 py-2 bg-red-400 fade-in'>
            <span className='text-sm text-neutral-900'>
                {message}
            </span>
        </div>
    )
}


export default function SignInPage() {

    const [loginState, setLoginState] = useState<LoginState | null>(null)
    const [notification, setNotification] = useState<string | null>(null)

    function openDeepLink(credential: OAuthCredential, providerId: string) {
        // get current url param called 'redirect' and 'protocol'
        const urlParams = new URLSearchParams(window.location.search)
        const redirect = urlParams.get('redirect') || 'auth'
        const protocol = urlParams.get('protocol') || 'steer'
        const credentialString = JSON.stringify(credential.toJSON())

        setTimeout(() => {
            window.location.href = `${protocol}://${redirect}?provider=${providerId}&credentials=${credentialString}`
        }, 250)
    }

    async function handleLogin(provider: string) {
        let resp: {
            credential: OAuthCredential | null;
            result: UserCredential;
        } | null

        try {
            switch (provider) {
                case 'google.com':
                    resp = await loginGoogle();
                    break;
                case 'github.com':
                    resp = await loginGitHub();
                    break;
                default:
                    throw new Error(`Invalid provider: ${provider}`);
            }
            if (!resp || !resp.credential) {
                throw new Error("Invalid credentials. Try again")
            }

            const { credential, result } = resp;
            console.log(credential, result);
            setLoginState({
                credential,
                result,
                provider
            })
            //   openDeepLink(credential, provider)
            return true;

        } catch (e) {
            console.error(e)
            if (e instanceof Error) {
                setNotification(e.message)
            } else {
                setNotification("Login failed. Try again")
            }
            setTimeout(() => {
                setNotification(null)
            }, 5000)
            return false
        }
    }

    const openDeepLinkCallback = useCallback(() => {
        if (loginState) {
            openDeepLink(loginState.credential, loginState.provider)
        }
    }, [loginState])


    return (
        <QueryClientProvider client={queryClient}>
            <main className="flex-1 flex flex-col items-center justify-center mb-40">
                {loginState === null ? (
                    <NoUserView onLogin={handleLogin} />
                ) : (
                    <LoggedUserView loginState={loginState} onOpenApp={openDeepLinkCallback} />
                )}
            </main>

            <Notification message={notification} />
        </QueryClientProvider>
    )
}
