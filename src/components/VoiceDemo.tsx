import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mic, MicOff, PhoneOff, X, ThumbsDown, Minus, ThumbsUp } from 'lucide-react';
import { RETELL_CONFIG } from '../config/retell';
import { RetellWebClient } from 'retell-client-js-sdk';

/**
 * VoiceDemo Component - German B2C Version
 *
 * Two-step flow:
 * 1. Collect Name + Phone (lead capture)
 * 2. Start voice call with LEO
 */

// n8n webhook URL for lead capture
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

// Google Ads conversion tracking
declare function gtag(...args: unknown[]): void;

interface VoiceDemoProps {
  agentId?: string;
  agentName?: string;
  onClose?: () => void;
}

const VoiceDemo: React.FC<VoiceDemoProps> = ({
  agentId = RETELL_CONFIG.DEFAULT_AGENT_ID,
  agentName = 'LEO',
  onClose
}) => {
  // Form state
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Call state
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const retellClientRef = useRef<RetellWebClient | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);

      const leadData = {
        name: formData.name,
        phone: formData.phone,
        source: 'voice_widget',
        utm_source: urlParams.get('utm_source') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        timestamp: new Date().toISOString(),
      };

      // Send to n8n webhook
      if (N8N_WEBHOOK_URL) {
        await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
        });
      }

      // Fire Google Ads conversion
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual values
        });
      }

      setFormSubmitted(true);
      // Automatically start the call after form submission
      startVoiceCall();
    } catch (err) {
      console.error('Lead submission error:', err);
      setFormError('Es gab einen Fehler. Bitte versuchen Sie es erneut.');
      setIsSubmitting(false);
    }
  };

  const startVoiceCall = async () => {
    try {
      setError(null);
      setIsConnecting(true);

      console.log('Starting voice call with agent:', agentId);

      // Create WebRTC call using Retell API V2
      const response = await fetch(`${RETELL_CONFIG.BASE_URL}/v2/create-web-call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RETELL_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
          sample_rate: 24000,
          enable_backchannel: true,
          dynamic_variables: [
            { name: 'caller_name', value: formData.name },
            { name: 'caller_phone', value: formData.phone }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const callData = await response.json();
      console.log('WebRTC call created:', callData);

      // Store call ID for rating
      if (callData.call_id) {
        setCallId(callData.call_id);
      }

      // Initialize Retell Web Client
      const retellClient = new RetellWebClient();
      retellClientRef.current = retellClient;

      // Set up event listeners
      retellClient.on('call_started', () => {
        console.log('Call started successfully');
        setIsConnecting(false);
        setIsCalling(true);
      });

      retellClient.on('call_ended', () => {
        console.log('Call ended');
        setIsCalling(false);
        setIsConnecting(false);
        // Show rating modal after call ends
        setShowRating(true);
      });

      retellClient.on('error', (error: unknown) => {
        console.error('Retell client error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
        setError(`Verbindungsfehler: ${errorMessage}`);
        setIsConnecting(false);
        setIsCalling(false);
      });

      // Start the call with the access token
      await retellClient.startCall({
        accessToken: callData.access_token,
      });

    } catch (err) {
      console.error('Error starting voice call:', err);
      setError(`Anruf konnte nicht gestartet werden: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
      setIsConnecting(false);
      setIsCalling(false);
    }
  };

  const endCall = async () => {
    try {
      if (retellClientRef.current) {
        await retellClientRef.current.stopCall();
        console.log('Call ended successfully');
      }
    } catch (err) {
      console.error('Error ending call:', err);
    }

    setIsCalling(false);
    setIsMuted(false);
    setError(null);
    setIsConnecting(false);
    retellClientRef.current = null;

    // Show rating modal instead of closing
    setShowRating(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retellClientRef.current) {
        try {
          retellClientRef.current.stopCall();
        } catch (err) {
          console.error('Error stopping call on unmount:', err);
        }
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    console.log('Mute toggled:', !isMuted);
  };

  const submitRating = async (rating: number) => {
    console.log('Rating submitted:', rating, 'for call:', callId);

    // Send rating to n8n webhook (will be implemented later)
    if (N8N_WEBHOOK_URL) {
      try {
        await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'rating',
            call_id: callId,
            rating: rating, // -1, 0, or 1
            name: formData.name,
            phone: formData.phone,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error('Rating submission error:', err);
      }
    }

    // Close modal
    setShowRating(false);
    if (onClose) {
      onClose();
    }
  };

  const skipRating = () => {
    console.log('Rating skipped');
    setShowRating(false);
    if (onClose) {
      onClose();
    }
  };

  // Rating state - after call ended
  if (showRating) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-leo-dark mb-2">
                War LEO hilfreich?
              </h3>
              <p className="text-leo-gray text-sm">
                Ihre Bewertung hilft LEO, sich ständig zu verbessern.
              </p>
            </div>

            <div className="flex justify-center space-x-6 mb-8">
              <button
                onClick={() => submitRating(-1)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-red-50 transition-colors group"
                title="Nicht hilfreich"
              >
                <div className="w-16 h-16 bg-gray-100 group-hover:bg-red-100 rounded-full flex items-center justify-center transition-colors">
                  <ThumbsDown className="h-8 w-8 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
              </button>

              <button
                onClick={() => submitRating(0)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 transition-colors group"
                title="Neutral"
              >
                <div className="w-16 h-16 bg-gray-100 group-hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                  <Minus className="h-8 w-8 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </button>

              <button
                onClick={() => submitRating(1)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-green-50 transition-colors group"
                title="Hilfreich"
              >
                <div className="w-16 h-16 bg-gray-100 group-hover:bg-green-100 rounded-full flex items-center justify-center transition-colors">
                  <ThumbsUp className="h-8 w-8 text-gray-400 group-hover:text-green-500 transition-colors" />
                </div>
              </button>
            </div>

            <button
              onClick={skipRating}
              className="text-leo-gray hover:text-leo-dark text-sm transition-colors"
            >
              Überspringen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Connecting state
  if (isConnecting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full relative">
          <button
            onClick={endCall}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-leo-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Phone className="h-10 w-10 text-leo-blue" />
              </div>
              <h3 className="text-xl font-bold text-leo-dark mb-2">
                Verbindung wird hergestellt...
              </h3>
              <p className="text-leo-gray">
                Bitte warten Sie einen Moment
              </p>
            </div>

            <button
              onClick={endCall}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active call state
  if (isCalling) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-leo-dark mb-2">
                Verbunden mit {agentName}
              </h3>
              <p className="text-leo-gray">
                Beschreiben Sie Ihr Heizungsproblem oder nennen Sie den Fehlercode
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isMuted ? 'Mikrofon aktivieren' : 'Mikrofon stumm schalten'}
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>

              <button
                onClick={endCall}
                className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                title="Gespräch beenden"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>

            <div className="text-sm text-leo-gray">
              <p>LEO hört zu und antwortet sofort</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial state - Lead capture form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-leo-dark mb-2">
            Jetzt mit LEO sprechen
          </h3>
          <p className="text-leo-gray text-sm">
            Bitte geben Sie Ihre Daten ein, damit wir Sie erreichen können
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-leo-dark mb-1">
              Name
            </label>
            <input
              type="text"
              id="modal-name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leo-blue focus:border-transparent"
              placeholder="Ihr Name"
            />
          </div>

          <div>
            <label htmlFor="modal-phone" className="block text-sm font-medium text-leo-dark mb-1">
              Mobilnummer
            </label>
            <input
              type="tel"
              id="modal-phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leo-blue focus:border-transparent"
              placeholder="0170 1234567"
            />
          </div>

          {formError && (
            <p className="text-sm text-red-600 text-center">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-leo-yellow hover:bg-leo-yellow/90 text-leo-dark px-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            <Phone className="h-5 w-5" />
            {isSubmitting ? 'Wird verbunden...' : 'Jetzt mit LEO sprechen'}
          </button>
        </form>

        <p className="text-xs text-leo-gray text-center mt-4">
          Mit dem Absenden stimmen Sie unserer{' '}
          <a href="#datenschutz" className="text-leo-blue hover:underline" onClick={onClose}>
            Datenschutzerklärung
          </a>{' '}
          zu. Das Gespräch wird zur Qualitätssicherung aufgezeichnet.
        </p>
      </div>
    </div>
  );
};

export default VoiceDemo;
