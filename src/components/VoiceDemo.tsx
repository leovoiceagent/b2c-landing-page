import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mic, MicOff, PhoneOff } from 'lucide-react';
import { RETELL_CONFIG } from '../config/retell';
import { RetellWebClient } from 'retell-client-js-sdk';

/**
 * VoiceDemo Component - German B2C Version
 *
 * Voice calling interface that connects to Retell AI.
 * Simplified for consumer use - less technical language.
 */

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
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const retellClientRef = useRef<RetellWebClient | null>(null);

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
          dynamic_variables: []
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const callData = await response.json();
      console.log('WebRTC call created:', callData);

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

    // Close the modal
    if (onClose) {
      onClose();
    }
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

  // Connecting state
  if (isConnecting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
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
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
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

  // Initial state - Start call prompt
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-leo-yellow/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-10 w-10 text-leo-dark" />
            </div>
            <h3 className="text-xl font-bold text-leo-dark mb-2">
              Jetzt mit LEO sprechen
            </h3>
            <p className="text-leo-gray">
              Beschreiben Sie Ihr Problem oder nennen Sie den Fehlercode
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={startVoiceCall}
              className="w-full bg-leo-yellow hover:bg-leo-yellow/90 text-leo-dark px-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="h-5 w-5" />
              Gespräch starten
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-leo-gray px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Abbrechen
              </button>
            )}
          </div>

          <p className="text-xs text-leo-gray mt-4">
            Kostenlos und unverbindlich
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceDemo;
