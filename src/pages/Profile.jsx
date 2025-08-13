import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Phone, Briefcase, Calendar } from 'lucide-react'

const Profile = () => {
  const { employee } = useAuth()

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Your account information</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="h-20 w-20 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {employee?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-semibold text-gray-900">{employee?.fullName}</h2>
            <p className="text-gray-600">{employee?.designation}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{employee?.email}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Phone className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Mobile Number</p>
              <p className="text-gray-900">{employee?.mobileNumber}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Designation</p>
              <p className="text-gray-900">{employee?.designation}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-gray-900">
                {employee?.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
