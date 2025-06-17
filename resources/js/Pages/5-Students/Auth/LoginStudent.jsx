import { Inertia } from '@inertiajs/inertia';
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';

export default function StudentLogin({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    ic_num: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showIC, setShowIC] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    post(route('student.login'), {
        data: {
            ic_num: data.ic_num,
        },
        onSuccess: () => {
            // Redirect to the student dashboard on success
            Inertia.visit(route('student.dashboard'));
        },
        onError: (backendErrors) => {
            // Handle backend validation errors (e.g., invalid IC number)
            setError(backendErrors.ic_num || 'An error occurred.');
        },
    });
};



  return (
    <div className="min-h-screen bg-white flex">
      <Head title="TVPSS | Login Pelajar" />

     { /* Left Column - Image */}
      <div className="hidden lg:flex w-[100%] bg-[#4158A6] items-center justify-center">
        <img 
          src="/assets/login1.jpg" 
          alt="Login Illustration" 
          className="w-full h-full object-cover"
        />
      </div>
        {/* Right Column - Login Form */}
              <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 relative bg-gradient-to-b from-gray-50 to-white">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-100 rounded-full -mr-24 -mb-24 opacity-30" />
                
                {/* Back Button */}
                <Link 
                  href="/" 
                  className="absolute top-8 left-8 p-3 rounded-full hover:bg-white/80 transition-all duration-200 flex items-center justify-center group"
                  aria-label="Kembali"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-blue-600" /> 
                </Link>
        
                <div className="w-full max-w-md relative">
                  <div className="bg-white/80 backdrop-blur-sm px-8 py-12 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex flex-col items-center mb-10">
                      <div className="relative">
                        <div className="absolute -inset-4 bg-white rounded-full blur-lg opacity-30" />
                        <img 
                          src="/assets/TVPSSLogo2.jpg" 
                          alt="TVPSS Logo" 
                          className="h-24 w-auto relative" 
                        />
                      </div>
                      <h1 className="text-3xl font-bold bg-[#4158A6] bg-clip-text text-transparent mt-8 mb-2">
                        Log Masuk | Pelajar
                      </h1>
                      <p className="text-gray-600 text-sm mb-2">
                        Sila masukkan nombor kad pengenalan untuk log masuk!
                      </p>
                    </div>
        
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 animate-shake">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          {error}
                        </div>
                      </div>
                    )}
        
                    <form onSubmit={handleLogin} className="space-y-6">
        
                      {/* Password Input */}
                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          No Kad Pengenalan
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                          </div>
                          <input
                            id="ic_num"
                            type="text"
                            name="ic_num"
                            value={data.ic_num}
                            placeholder="Masukkan 12 digit Kad Pengenalan"
                            className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            onChange={(e) => setData({ ...data, ic_num: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
        
                      {/* Login Button */}
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-[#4158A6] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={processing}
                      >
                        {processing ? (
                          <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          "Log Masuk"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        }
