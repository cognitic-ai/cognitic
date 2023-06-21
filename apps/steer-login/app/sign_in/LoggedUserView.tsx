import Button from "@/components/Button";
import type { Config, User } from "@/utils/types";
import type { OAuthCredential, UserCredential } from "firebase/auth";
import { useQuery } from "react-query";
import LoggedUserSubview from "./LoggedUserSubview";
import { useEffect } from "react";

export type LoginState = {
    credential: OAuthCredential;
    result: UserCredential;
    provider: string;
}

type LoggedUserViewProps = {
    onOpenApp: () => void;
    loginState: LoginState;
};


// @ts-ignore
function fetchUserByID({ queryKey }) {
    const [_key, { uid }] = queryKey
    return fetch(`https://sidekick-370118.uc.r.appspot.com/user/${'2gqw1anUzMTj9T57bJwJs0KxXMJ2'}`)
        .then(r => r.json())
        .catch((e) => {
            console.log(e);
            return null
        }) as Promise<User | null>
}

function fetchConfig() {
    return fetch('https://sidekick-370118.uc.r.appspot.com/stripe/config')
        .then(r => r.json()) as Promise<Config>
}

export default function LoggedUserView({ onOpenApp, loginState }: LoggedUserViewProps) {
    const config = useQuery('config', fetchConfig)
    const user = useQuery(['user', { uid: loginState.result.user.uid }], fetchUserByID)
    const isPremium = user.data?.tier === 'premium'

    useEffect(() => {
        if (isPremium) setTimeout(onOpenApp, 500)
    }, [isPremium])

    return (
        <div className="flex flex-col items-center justify-center gap-6">

            <h1 className="text-3xl font-bold text-center text-content-primary">
                Welcome to Steer
            </h1>

            {user.data?.uid && config.data
                ?
                <LoggedUserSubview user={user.data} config={config.data}>
                    <>
                        <p className="text-content-secondary text-center">
                            Please continue to the app. By clicking this button
                        </p>

                        <Button
                            onClick={async () => {
                                onOpenApp()
                                return true;
                            }}
                            variant='primary'
                        >
                            Open App
                        </Button>
                    </>
                </LoggedUserSubview>
                : <>
                    <p className="text-content-secondary text-center">
                        Please continue to the app. By clicking this button
                    </p>

                    <Button
                        onClick={async () => {
                            onOpenApp()
                            return true;
                        }}
                        variant='primary'
                    >
                        Open App
                    </Button>
                </>
            }
        </div>
    )
}