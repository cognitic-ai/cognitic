import Button from "@/components/Button";
import type { User, Config } from "@/utils/types";
import { ReactNode } from "react";


type UserSubviewProps = {
    user: User;
    config: Config;
    children?: ReactNode;
};

export default function LoggedUserSubview({ user, config, children }: UserSubviewProps) {
    if (user.tier === 'free') {
        return (
            <div className="flex flex-col items-center justify-center gap-6">
                <p className="text-content-secondary text-center">
                    It looks like you are not a premium member. <br />
                    Consider to purchase our premium subscription to get
                    more daily requests.
                </p>

                <Button
                    onClick={async () => {
                        window.open(`${config.checkout_url}?client_reference_id=${user.uid}&prefilled_email=${user.email}`)
                    }}
                    variant='secondary'
                >
                    Upgrade to Premium
                </Button>

                <div role='separator' className='h-px w-full bg-background-secondary' />

                {children}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6">

            {children}

            <div role='separator' className='h-px w-full bg-background-secondary' />

            <p className="text-content-secondary text-center">
                Thank you for your support <br />
                Your premium subscription is valid until <br />
                <b className='text-content-primary my-4'>
                    {user.stripe
                        ? <>{new Date(user.stripe.subscribed_until).toLocaleString()}</>
                        : <>No data</>
                    }
                </b>
            </p>

            <p className="text-content-secondary text-center text-sm">
                If you no longer want to use Steer premium <br />

                you can
                <a
                    href={`${config.customer_portal_url}?client_reference_id=${user.uid}&prefilled_email=${user.email}`}
                    target='_blank'
                    className='ml-1 hover:underline text-content-secondary hover:text-content-primary text-sm'
                >
                    manage your subscription here
                </a>
            </p>



        </div>
    )
}