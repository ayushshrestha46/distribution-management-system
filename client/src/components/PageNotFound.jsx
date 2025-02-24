import { PlugZap, HomeIcon } from 'lucide-react';
import { Button } from './ui/button';

function PageNotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-sky-400 to-[#0a357a] flex items-center justify-center p-6 overflow-hidden">
            <div className="max-w-2xl w-full text-center space-y-10 bg-white p-10 rounded-3xl shadow-2xl">
                <div className="animate-pulse">
                    <PlugZap className="w-28 h-28 mx-auto text-[#1E3A8A]" />
                </div>

                <div className="space-y-6 animate-fade-up [animation-delay:200ms]">
                    <h1 className="text-8xl font-extrabold text-gray-800 tracking-tight">
                        4
                        <span className="inline-block animate-bounce [animation-delay:500ms] text-[#1E3A8A]">
                            0
                        </span>
                        4
                    </h1>
                    <p className="text-2xl text-gray-700 max-w-lg mx-auto">
                        Sorry, we can't seem to find the page you're looking for.
                    </p>
                </div>

                <Button
                    onClick={() => (window.location.href = '/')}
                    className="animate-fade-up [animation-delay:400ms] inline-flex items-center px-8 py-4 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-lg  rounded-full"
                    size="lg"
                >
                    <HomeIcon className="w-6 h-6 mr-3" />
                    Back to Home
                </Button>
            </div>
        </div>
    );
}

export default PageNotFound;
