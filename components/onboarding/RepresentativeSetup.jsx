import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { User } from '../../entities/User';
import { Shield, ArrowRight, Upload } from 'lucide-react';

export default function RepresentativeSetup({ onComplete }) {
  const [formData, setFormData] = useState({
    office: '',
    position: '',
    state: '',
    district: '',
    verificationDocument: null,
    additionalInfo: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const states = [
    'D.C.','AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // MVP: Only allow House and Senate for now
  const officeTypes = [
    'House of Representatives',
    'Senate',
    // 'Governor',
    // 'State Legislature',
    // 'Local Government',
    // 'Cabinet Position',
    // 'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        verificationDocument: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call - replace with actual implementation
      await User.update({
        office: formData.office,
        position: formData.position,
        state: formData.state,
        district: formData.district,
        verification_status: 'pending',
        additional_info: formData.additionalInfo
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call the onComplete callback to proceed to dashboard
      onComplete();
    } catch (error) {
      console.error('Error updating representative info:', error);
      alert('Error submitting verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.office && formData.position && formData.state;

  return (
    <Card className="terminal-surface border-gray-700 terminal-glow w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl terminal-text">Representative Verification</CardTitle>
        <p className="text-center terminal-muted mt-2">
          Please provide your official information for verification.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="office" className="terminal-text">Office Type</Label>
              <select
                id="office"
                value={formData.office}
                onChange={(e) => handleInputChange('office', e.target.value)}
                className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md"
              >
                <option value="">Select your office type</option>
                {officeTypes.map(office => (
                  <option key={office} value={office}>
                    {office}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="position" className="terminal-text">Position/Title</Label>
              <Input
                id="position"
                type="text"
                placeholder="e.g., U.S. Representative, Chief of Staff, District Director"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="terminal-input border-gray-600 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state" className="terminal-text">State</Label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="terminal-input border-gray-600 bg-gray-800 text-white w-full h-10 px-3 py-2 rounded-md"
                >
                  <option value="">Select state</option>
                  {states.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="district" className="terminal-text">District Number</Label>
                <Input
                  id="district"
                  type="text"
                  placeholder="District number"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="terminal-input border-gray-600 bg-gray-800 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="verificationDocument" className="terminal-text">
                Verification Document
              </Label>
              <div className="mt-2">
                <label className="flex items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Official ID, badge, or verification document (PDF, JPG, PNG)
                    </p>
                  </div>
                  <input
                    id="verificationDocument"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </label>
                {formData.verificationDocument && (
                  <p className="mt-2 text-sm text-green-400">
                    ✓ {formData.verificationDocument.name} selected
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="additionalInfo" className="terminal-text">
                Additional Information (Optional)
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any additional information that might help with verification..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                className="terminal-input border-gray-600 bg-gray-800 text-white"
                rows={3}
              />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">Verification Process</h4>
            <p className="text-sm text-gray-300">
              Your information will be reviewed by our verification team. This typically takes 1-2 business days. 
              You'll receive an email notification once your account is verified.
            </p>
          </div>

          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Go back to role selection
                window.location.reload();
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting for verification...
                </div>
              ) : (
                <div className="flex items-center">
                  Submit for Verification
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 