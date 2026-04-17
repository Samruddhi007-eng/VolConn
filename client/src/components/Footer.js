import React from 'react';

const Footer = ({ variant = 'volunteer' }) => {
  return (
    <footer className="bg-white border-t mt-20 p-8 md:p-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-10">
        <div>
          <h5 className="font-black text-volconn-navy mb-4 uppercase text-xs tracking-widest">About Volconn</h5>
          <p className="text-sm text-slate-400">
            {variant === 'ngo' 
              ? 'Streamlining NGO operations by matching mission-driven projects with professional talent.'
              : 'Connecting talent with purpose. We empower NGOs by providing them access to skilled professionals like you.'
            }
          </p>
        </div>
        <div>
          <h5 className="font-black text-volconn-navy mb-4 uppercase text-xs tracking-widest">
            {variant === 'ngo' ? 'Compliance' : 'Quick Links'}
          </h5>
          <ul className="text-sm text-slate-500 space-y-2 font-bold">
            {variant === 'ngo' ? (
              <>
                <li className="hover:text-volconn-gold cursor-pointer transition-colors">NGO Guidelines</li>
                <li className="hover:text-volconn-gold cursor-pointer transition-colors">Privacy Policy</li>
              </>
            ) : (
              <>
                <li className="hover:text-volconn-gold cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-volconn-gold cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-volconn-gold cursor-pointer transition-colors">Support</li>
              </>
            )}
          </ul>
        </div>
        <div>
          <h5 className="font-black text-volconn-navy mb-4 uppercase text-xs tracking-widest">
            {variant === 'ngo' ? 'Support' : 'Contact'}
          </h5>
          <p className="text-sm text-slate-400">
            {variant === 'ngo' 
              ? <>ngo-help@volconn.com<br/>24/7 Support Line Available</>
              : <>support@volconn.com<br/>Mumbai, India</>
            }
          </p>
        </div>
      </div>
      <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
        © 2026 Volconn Platform {variant === 'ngo' ? '• Enterprise Edition' : '• Built for Social Impact'}
      </p>
    </footer>
  );
};

export default Footer;
