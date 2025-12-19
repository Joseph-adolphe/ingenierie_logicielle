import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import appMockup from "@/assets/app-mockup.png";

export default function AppShowcase() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    return (
        <section className="bg-gray-900 py-24 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 text-white space-y-8">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                            📱 Application Mobile
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Tout vos services <br />
                            <span className="text-blue-500">dans votre poche</span>
                        </h2>
                        <p className="text-lg text-gray-400 max-w-lg">
                            Installer l'application Helpix pour gérer vos rendez-vous, discuter avec les professionnels et payer en toute sécurité, où que vous soyez.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                onClick={handleInstallClick}
                                disabled={!isInstallable}
                                className={`h-14 px-6 rounded-xl flex items-center gap-3 ${isInstallable
                                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.523 15.3414C17.5144 11.2312 20.9416 9.42398 21.0963 9.33649C19.897 7.62125 18.043 7.37075 17.2662 7.3375C15.6568 7.19975 14.0768 8.27211 13.9142 8.27211C12.4496 8.27211 11.0827 7.15197 9.54486 7.18524C7.54016 7.2185 5.69806 8.36991 4.67385 10.1449C2.58557 13.765 4.14442 19.1412 6.16481 22.0688C7.16335 23.5049 8.35626 25.122 9.92348 25.0721C11.4402 25.0138 11.9961 24.1107 13.8827 24.1107C15.7441 24.1107 16.2081 25.0721 17.8228 25.0471C19.4627 25.0138 20.5054 23.5611 21.4668 22.1416C22.1627 21.1303 22.4477 20.6268 22.4477 20.6268C22.4042 20.6081 19.1557 18.5752 19.1557 15.3414H17.523ZM14.9602 5.17643C15.7538 4.21506 16.2913 2.87293 16.1424 1.55164C14.9763 1.59948 13.5654 2.33303 12.7237 3.32135C11.9682 4.17972 11.2855 5.53986 11.4706 6.82987C12.7836 6.92972 14.1678 6.13702 14.9602 5.17643Z" transform="translate(0 -2)" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-semibold">
                                        {isInstallable ? 'Installer sur' : 'Déjà installé'}
                                    </div>
                                    <div className="text-sm font-bold leading-none">PC</div>
                                </div>
                            </Button>
                            <Button
                                size="lg"
                                onClick={handleInstallClick}
                                disabled={!isInstallable}
                                className={`h-14 px-6 rounded-xl flex items-center gap-3 ${isInstallable
                                    ? 'bg-transparent border border-gray-700 text-white hover:bg-white/10'
                                    : 'bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186c-.184.184-.43.275-.724.159-.395-.156-.566-.647-.566-1.07V2.726c0-.422.171-.914.566-1.07.294-.117.54.026.723.159zM15.636 13.845L18.89 17.1l-2.007 1.144a1.07 1.07 0 0 1-1.096-.023l-1.08-.616 1.93-3.76zm4.839 2.05l-2.076-1.184-2.185-2.185 2.18-.707 2.08 1.185c.78.444.78 1.168 0 1.613v.001a1.32 1.32 0 0 1-.001 1.277zM14.697 9.538l-1.929-3.76 1.08-.616c.338-.192.738-.175 1.096.023l2.006 1.144-2.253 3.209z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-semibold">
                                        {isInstallable ? 'Installer sur' : 'Déjà installé'}
                                    </div>
                                    <div className="text-sm font-bold leading-none">Mobile</div>
                                </div>
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs font-bold">
                                        U{i}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-400">
                                Rejoint par <span className="text-white font-semibold">10,000+ utilisateurs</span> ce mois-ci
                            </p>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative z-10">
                        <div className="relative mx-auto w-[280px] md:w-[320px]">
                            <img
                                src={appMockup}
                                alt="App Interface"
                                className="w-full relative z-10 drop-shadow-2xl"
                            />
                            {/* Decorative elements around phone */}
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl opacity-20" />
                            <div className="absolute top-1/2 -left-20 w-32 h-32 bg-blue-500 rounded-full blur-xl opacity-20" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
