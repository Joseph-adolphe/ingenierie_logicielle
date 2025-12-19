import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaFlag } from 'react-icons/fa';

type UserProfileProps = {
  user?: {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    city?: string;
    country?: string;
    birthday?: string;
    role: string;
    profile_picture?: string;
    is_active: boolean;
  };
};

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // Données simulées si aucun user fourni
  const currentUser = user || {
    id: 1,
    name: 'Arthur',
    surname: 'Djiki',
    email: 'arthur@example.com',
    phone: '123456789',
    city: 'Yaoundé',
    country: 'Cameroun',
    birthday: '1995-10-06',
    role: 'customer',
    profile_picture: '',
    is_active: true,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      {/* Photo de profil */}
      <div className="flex justify-center mb-4">
        {currentUser.profile_picture ? (
          <img
            src={currentUser.profile_picture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 text-3xl font-bold border-2 border-blue-500">
            {currentUser.name[0].toUpperCase()}
          </div>
        )}
      </div>

      {/* Nom et rôle */}
      <h2 className="text-2xl font-semibold text-center text-blue-700">
        {currentUser.name} {currentUser.surname}
      </h2>
      <p className="text-center text-sm text-gray-500 mb-4">{currentUser.role}</p>

      {/* Informations */}
      <div className="space-y-3">
        <div className="flex items-center text-gray-700">
          <FaEnvelope className="mr-2 text-blue-500" />
          <span>{currentUser.email}</span>
        </div>
        {currentUser.phone && (
          <div className="flex items-center text-gray-700">
            <FaPhone className="mr-2 text-blue-500" />
            <span>{currentUser.phone}</span>
          </div>
        )}
        {currentUser.city && (
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            <span>{currentUser.city}</span>
          </div>
        )}
        {currentUser.country && (
          <div className="flex items-center text-gray-700">
            <FaFlag className="mr-2 text-blue-500" />
            <span>{currentUser.country}</span>
          </div>
        )}
        {currentUser.birthday && (
          <div className="flex items-center text-gray-700">
            <FaBirthdayCake className="mr-2 text-blue-500" />
            <span>{currentUser.birthday}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
