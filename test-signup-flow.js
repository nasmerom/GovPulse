// Test script to simulate signup flow
console.log('=== Testing Signup Flow ===');

// Clear localStorage
localStorage.clear();
console.log('1. Cleared localStorage');

// Test User.me() with no stored user
import('../entities/User.js').then(({ User }) => {
  User.me().then(user => {
    console.log('2. User.me() result:', user);
    console.log('3. User account_type:', user.account_type);
    console.log('4. User onboarding_completed:', user.onboarding_completed);
    
    // Test isOnboardingCompleted
    User.isOnboardingCompleted().then(completed => {
      console.log('5. isOnboardingCompleted:', completed);
      
      // Test creating a user
      User.create({
        name: 'Test User',
        email: 'test@example.com',
        account_type: 'Citizen',
        onboarding_completed: false
      }).then(newUser => {
        console.log('6. Created user:', newUser);
        
        // Test isOnboardingCompleted again
        User.isOnboardingCompleted().then(completed2 => {
          console.log('7. isOnboardingCompleted after creation:', completed2);
        });
      });
    });
  });
}); 