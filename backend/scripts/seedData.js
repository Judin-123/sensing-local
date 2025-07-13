// scripts/seedData.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Ward = require('../models/Ward');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('Starting data seeding process...');
    
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Campaign.deleteMany({}),
      Ward.deleteMany({}),
      Task.deleteMany({}),
      Attendance.deleteMany({})
    ]);

    console.log('✓ Cleared existing data');

    // 1. Create Users (Coordinators, Volunteers, Admins)
    const users = await User.create([
      {
        name: 'John Coordinator',
        email: 'john@example.com',
        passHash: 'password123',
        role: 'coordinator',
        score: 150,
        address: '123 Coordinator Street, Downtown'
      },
      {
        name: 'Sarah Coordinator',
        email: 'sarah@example.com',
        passHash: 'password123',
        role: 'coordinator',
        score: 180,
        address: '456 Admin Avenue, Central'
      },
      {
        name: 'Jane Volunteer',
        email: 'jane@example.com',
        passHash: 'password123',
        role: 'volunteer',
        score: 75,
        address: '789 Volunteer Lane, North'
      },
      {
        name: 'Alice Volunteer',
        email: 'alice@example.com',
        passHash: 'password123',
        role: 'volunteer',
        score: 90,
        address: '321 Helper Road, South'
      },
      {
        name: 'Bob Volunteer',
        email: 'bob@example.com',
        passHash: 'password123',
        role: 'volunteer',
        score: 65,
        address: '654 Service Street, East'
      },
      {
        name: 'Charlie Volunteer',
        email: 'charlie@example.com',
        passHash: 'password123',
        role: 'volunteer',
        score: 110,
        address: '987 Community Circle, West'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        passHash: 'password123',
        role: 'admin',
        score: 200,
        address: '111 Admin Plaza, Center'
      }
    ]);

    console.log(`✓ Created ${users.length} users`);

    // Extract user roles for easy reference
    const coordinators = users.filter(user => user.role === 'coordinator');
    const volunteers = users.filter(user => user.role === 'volunteer');
    const admins = users.filter(user => user.role === 'admin');

    // 2. Create Wards
    const wards = await Ward.create([
      {
        wardId: 'WARD001',
        wardName: 'Central Ward',
        location: 'Downtown Area',
        coordinates: {
          latitude: 12.9716,
          longitude: 77.5946
        }
      },
      {
        wardId: 'WARD002',
        wardName: 'North Ward',
        location: 'North District',
        coordinates: {
          latitude: 12.9816,
          longitude: 77.6046
        }
      },
      {
        wardId: 'WARD003',
        wardName: 'South Ward',
        location: 'South District',
        coordinates: {
          latitude: 12.9616,
          longitude: 77.5846
        }
      },
      {
        wardId: 'WARD004',
        wardName: 'East Ward',
        location: 'East District',
        coordinates: {
          latitude: 12.9716,
          longitude: 77.6146
        }
      }
    ]);

    console.log(`✓ Created ${wards.length} wards`);

    // 3. Create Campaigns with consistent volunteer assignments
    const campaigns = await Campaign.create([
      {
        title: 'Air Quality Monitoring Campaign',
        description: 'Comprehensive air quality monitoring in central areas using advanced sensors',
        wardId: wards[0]._id, // Central Ward
        startLoc: 'City Center Plaza',
        endLoc: 'Central Park Area',
        coordinatorId: coordinators[0]._id, // John Coordinator
        volunteerIds: [volunteers[0]._id, volunteers[1]._id, volunteers[2]._id], // Jane, Alice, Bob
        startDate: new Date('2025-07-15'),
        endDate: new Date('2025-07-16'),
        startTime: '09:00',
        endTime: '17:00',
        status: 'active',
        maxVolunteers: 5
      },
      {
        title: 'Water Quality Assessment',
        description: 'Testing water quality in north district rivers and lakes',
        wardId: wards[1]._id, // North Ward
        startLoc: 'North Station',
        endLoc: 'River Bank Park',
        coordinatorId: coordinators[0]._id, // John Coordinator
        volunteerIds: [volunteers[1]._id, volunteers[3]._id], // Alice, Charlie
        startDate: new Date('2025-07-20'),
        endDate: new Date('2025-07-21'),
        startTime: '08:00',
        endTime: '16:00',
        status: 'planned',
        maxVolunteers: 4
      },
      {
        title: 'Noise Pollution Survey',
        description: 'Measuring noise levels across south district residential areas',
        wardId: wards[2]._id, // South Ward
        startLoc: 'South Market',
        endLoc: 'Residential Complex',
        coordinatorId: coordinators[1]._id, // Sarah Coordinator
        volunteerIds: [volunteers[0]._id, volunteers[2]._id], // Jane, Bob
        startDate: new Date('2025-07-25'),
        endDate: new Date('2025-07-26'),
        startTime: '10:00',
        endTime: '18:00',
        status: 'planned',
        maxVolunteers: 3
      },
      {
        title: 'Waste Management Assessment',
        description: 'Evaluating waste management systems in east district',
        wardId: wards[3]._id, // East Ward
        startLoc: 'East Terminal',
        endLoc: 'Industrial Zone',
        coordinatorId: coordinators[1]._id, // Sarah Coordinator
        volunteerIds: [volunteers[3]._id], // Charlie
        startDate: new Date('2025-07-30'),
        endDate: new Date('2025-07-31'),
        startTime: '07:00',
        endTime: '15:00',
        status: 'planned',
        maxVolunteers: 2
      }
    ]);

    console.log(`✓ Created ${campaigns.length} campaigns`);

    // 4. Create Tasks - Ensuring all tasks belong to existing campaigns and volunteers
    const tasks = await Task.create([
      // Tasks for Air Quality Monitoring Campaign
      {
        campaignId: campaigns[0]._id,
        taskId: 'TASK001',
        title: 'Air Quality Sensor Setup',
        description: 'Install and configure air quality sensors at designated locations',
        volunteerId: volunteers[0]._id, // Jane
        location: 'Main Square',
        coordinates: {
          latitude: 12.9716,
          longitude: 77.5946
        },
        priority: 1,
        status: 'assigned',
        estimatedDuration: 60
      },
      {
        campaignId: campaigns[0]._id,
        taskId: 'TASK002',
        title: 'Data Collection - Morning Shift',
        description: 'Collect air quality readings during morning hours',
        volunteerId: volunteers[1]._id, // Alice
        location: 'Park Entrance',
        coordinates: {
          latitude: 12.9726,
          longitude: 77.5956
        },
        priority: 2,
        status: 'assigned',
        estimatedDuration: 45
      },
      {
        campaignId: campaigns[0]._id,
        taskId: 'TASK003',
        title: 'Data Collection - Afternoon Shift',
        description: 'Collect air quality readings during afternoon hours',
        volunteerId: volunteers[2]._id, // Bob
        location: 'Shopping District',
        coordinates: {
          latitude: 12.9706,
          longitude: 77.5936
        },
        priority: 2,
        status: 'assigned',
        estimatedDuration: 45
      },
      {
        campaignId: campaigns[0]._id,
        taskId: 'TASK004',
        title: 'Equipment Maintenance',
        description: 'Perform maintenance checks on monitoring equipment',
        location: 'Central Plaza',
        coordinates: {
          latitude: 12.9716,
          longitude: 77.5946
        },
        priority: 3,
        status: 'pending',
        estimatedDuration: 30
      },

      // Tasks for Water Quality Assessment Campaign
      {
        campaignId: campaigns[1]._id,
        taskId: 'TASK005',
        title: 'Water Sample Collection',
        description: 'Collect water samples from designated river points',
        volunteerId: volunteers[1]._id, // Alice
        location: 'North River Point A',
        coordinates: {
          latitude: 12.9816,
          longitude: 77.6046
        },
        priority: 1,
        status: 'assigned',
        estimatedDuration: 90
      },
      {
        campaignId: campaigns[1]._id,
        taskId: 'TASK006',
        title: 'pH Level Testing',
        description: 'Test pH levels of collected water samples',
        volunteerId: volunteers[3]._id, // Charlie
        location: 'North River Point B',
        coordinates: {
          latitude: 12.9826,
          longitude: 77.6056
        },
        priority: 1,
        status: 'assigned',
        estimatedDuration: 60
      },
      {
        campaignId: campaigns[1]._id,
        taskId: 'TASK007',
        title: 'Documentation and Reporting',
        description: 'Document findings and prepare preliminary reports',
        location: 'Field Office',
        coordinates: {
          latitude: 12.9816,
          longitude: 77.6046
        },
        priority: 2,
        status: 'pending',
        estimatedDuration: 120
      },

      // Tasks for Noise Pollution Survey Campaign
      {
        campaignId: campaigns[2]._id,
        taskId: 'TASK008',
        title: 'Noise Level Measurement - Residential',
        description: 'Measure noise levels in residential areas',
        volunteerId: volunteers[0]._id, // Jane
        location: 'South Residential Complex A',
        coordinates: {
          latitude: 12.9616,
          longitude: 77.5846
        },
        priority: 1,
        status: 'assigned',
        estimatedDuration: 75
      },
      {
        campaignId: campaigns[2]._id,
        taskId: 'TASK009',
        title: 'Noise Level Measurement - Commercial',
        description: 'Measure noise levels in commercial areas',
        volunteerId: volunteers[2]._id, // Bob
        location: 'South Market Area',
        coordinates: {
          latitude: 12.9606,
          longitude: 77.5836
        },
        priority: 1,
        status: 'assigned',
        estimatedDuration: 75
      },

      // Tasks for Waste Management Assessment Campaign
      {
        campaignId: campaigns[3]._id,
        taskId: 'TASK010',
        title: 'Waste Collection Point Survey',
        description: 'Survey and document waste collection points',
        volunteerId: volunteers[3]._id, // Charlie
        location: 'East Industrial Zone',
        coordinates: {
          latitude: 12.9716,
          longitude: 77.6146
        },
        priority: 1,
        status: 'assigned',
        estimatedDuration: 120
      },
      {
        campaignId: campaigns[3]._id,
        taskId: 'TASK011',
        title: 'Waste Segregation Analysis',
        description: 'Analyze waste segregation practices',
        location: 'East Collection Center',
        coordinates: {
          latitude: 12.9726,
          longitude: 77.6156
        },
        priority: 2,
        status: 'pending',
        estimatedDuration: 90
      }
    ]);

    console.log(`✓ Created ${tasks.length} tasks`);

    // 5. Create Attendance Records - For all volunteers assigned to campaigns
    const attendanceRecords = [];

    // Air Quality Monitoring Campaign attendance
    attendanceRecords.push(
      {
        campaignId: campaigns[0]._id,
        volunteerId: volunteers[0]._id, // Jane
        numOfTasksAssigned: 2, // TASK001, TASK008
        numOfTasksCompleted: 1,
        hasAttended: true,
        checkInTime: new Date('2025-07-15T09:00:00'),
        attendanceTime: new Date('2025-07-15T09:00:00')
      },
      {
        campaignId: campaigns[0]._id,
        volunteerId: volunteers[1]._id, // Alice
        numOfTasksAssigned: 2, // TASK002, TASK005
        numOfTasksCompleted: 0,
        hasAttended: true,
        checkInTime: new Date('2025-07-15T09:15:00'),
        attendanceTime: new Date('2025-07-15T09:15:00')
      },
      {
        campaignId: campaigns[0]._id,
        volunteerId: volunteers[2]._id, // Bob
        numOfTasksAssigned: 2, // TASK003, TASK009
        numOfTasksCompleted: 0,
        hasAttended: false
      }
    );

    // Water Quality Assessment Campaign attendance
    attendanceRecords.push(
      {
        campaignId: campaigns[1]._id,
        volunteerId: volunteers[1]._id, // Alice
        numOfTasksAssigned: 1, // TASK005
        numOfTasksCompleted: 0,
        hasAttended: false
      },
      {
        campaignId: campaigns[1]._id,
        volunteerId: volunteers[3]._id, // Charlie
        numOfTasksAssigned: 2, // TASK006, TASK010
        numOfTasksCompleted: 0,
        hasAttended: false
      }
    );

    // Noise Pollution Survey Campaign attendance
    attendanceRecords.push(
      {
        campaignId: campaigns[2]._id,
        volunteerId: volunteers[0]._id, // Jane
        numOfTasksAssigned: 1, // TASK008
        numOfTasksCompleted: 0,
        hasAttended: false
      },
      {
        campaignId: campaigns[2]._id,
        volunteerId: volunteers[2]._id, // Bob
        numOfTasksAssigned: 1, // TASK009
        numOfTasksCompleted: 0,
        hasAttended: false
      }
    );

    // Waste Management Assessment Campaign attendance
    attendanceRecords.push(
      {
        campaignId: campaigns[3]._id,
        volunteerId: volunteers[3]._id, // Charlie
        numOfTasksAssigned: 1, // TASK010
        numOfTasksCompleted: 0,
        hasAttended: false
      }
    );

    const attendance = await Attendance.create(attendanceRecords);
    console.log(`✓ Created ${attendance.length} attendance records`);

    // 6. Update Ward tasks references
    for (let i = 0; i < wards.length; i++) {
      const wardTasks = tasks.filter(task => {
        const campaign = campaigns.find(c => c._id.equals(task.campaignId));
        return campaign && campaign.wardId.equals(wards[i]._id);
      });
      
      await Ward.findByIdAndUpdate(wards[i]._id, {
        tasks: wardTasks.map(task => task._id)
      });
    }

    console.log('✓ Updated ward task references');

    // Display summary
    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log(`✓ Users: ${users.length} (${coordinators.length} coordinators, ${volunteers.length} volunteers, ${admins.length} admins)`);
    console.log(`✓ Wards: ${wards.length}`);
    console.log(`✓ Campaigns: ${campaigns.length}`);
    console.log(`✓ Tasks: ${tasks.length} (${tasks.filter(t => t.volunteerId).length} assigned, ${tasks.filter(t => !t.volunteerId).length} unassigned)`);
    console.log(`✓ Attendance Records: ${attendance.length}`);

    console.log('\n=== TEST CREDENTIALS ===');
    console.log('Coordinators:');
    console.log('  Email: john@example.com | Password: password123 | Role: coordinator');
    console.log('  Email: sarah@example.com | Password: password123 | Role: coordinator');
    console.log('\nVolunteers:');
    console.log('  Email: jane@example.com | Password: password123 | Role: volunteer');
    console.log('  Email: alice@example.com | Password: password123 | Role: volunteer');
    console.log('  Email: bob@example.com | Password: password123 | Role: volunteer');
    console.log('  Email: charlie@example.com | Password: password123 | Role: volunteer');
    console.log('\nAdmin:');
    console.log('  Email: admin@example.com | Password: password123 | Role: admin');

    console.log('\n=== DATA RELATIONSHIPS ===');
    console.log('Campaign → Ward → Tasks → Volunteers → Attendance');
    campaigns.forEach((campaign, index) => {
      const ward = wards.find(w => w._id.equals(campaign.wardId));
      const coordinator = coordinators.find(c => c._id.equals(campaign.coordinatorId));
      const campaignTasks = tasks.filter(t => t.campaignId.equals(campaign._id));
      const campaignAttendance = attendance.filter(a => a.campaignId.equals(campaign._id));
      
      console.log(`\n${index + 1}. ${campaign.title}`);
      console.log(`   Ward: ${ward.wardName} (${ward.location})`);
      console.log(`   Coordinator: ${coordinator.name}`);
      console.log(`   Volunteers: ${campaign.volunteerIds.length}`);
      console.log(`   Tasks: ${campaignTasks.length} (${campaignTasks.filter(t => t.volunteerId).length} assigned)`);
      console.log(`   Attendance Records: ${campaignAttendance.length}`);
    });

    console.log('\n=== READY FOR TESTING ===');
    console.log('All data is now consistent and properly linked!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
connectDB().then(() => {
  seedData();
});