import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (    
    
        // <GuestLayout>   
    <div className="flex h-screen">
        
        <div className="w-2/3 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
          <img 
            src="/assets/login1.jpg" 
            alt="Login SVG 1" 
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      
        <div className="w-1/3 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Lupa Kata Laluan</h2>
            <div className="mb-4 text-gray-600">
              Masukkan email anda dan kami akan email link pautan set semula kata laluan anda.
            </div>
            {status && (
              <div className="mb-4 text-green-500 font-medium">{status}</div>
            )}
            <form onSubmit={submit}>
              <div className="mb-4">
                <label htmlFor="email" className="block font-medium mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  className="mt-1 block w-full border rounded-lg px-3 py-3 shadow-md focus:ring-2 focus:ring-blue-300"
                  autoFocus
                  onChange={(e) => setData('email', e.target.value)}
                />
                {errors.email && (
                  <div className="text-red-500 mt-2">{errors.email}</div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#455185] text-white rounded-lg px-4 py-2 hover:bg-[#3C4565] focus:outline-none focus:ring-2 focus:ring-[#455185] disabled:opacity-50"
                  disabled={processing}
                >
                  Hantar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    // </GuestLayout>
        
    );
}
