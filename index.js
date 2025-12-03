/*
module.exports = {
  ...(typeof createLoginTracker !== 'undefined' && { createLoginTracker })
}; */

function createLoginTracker(userInfo) {
  // Create a copy to avoid modifying the original object
  const storedPassword = userInfo.password;
  const MAX_ATTEMPTS = 3;
  
  // Closure state: track failed attempts and locked status as well
  let failedAttempts = 0;
  let isLocked = false;
  
  // Return an arrow function that handles login attempts
  const loginAttempt = (passwordAttempt) => {
    // If account is locked, reject immediately
    if (isLocked) {
      return 'Account locked due to too many failed login attempts';
    }
    
    // Check if password matches
    if (passwordAttempt === storedPassword) {
      return 'Login successful';
    }
    
    // Failed attempt - increment counter
    failedAttempts++;
    
    // Check if account should be locked
    if (failedAttempts > MAX_ATTEMPTS) {
      isLocked = true;
      return 'Account locked due to too many failed login attempts';
    }
    
    // Failed but still have attempts left
    return `Attempt ${failedAttempts}: Login failed`;
  };
  
  return loginAttempt;
}

module.exports = { createLoginTracker };

// Demo/test code (runs only when executed directly)
if (require.main === module) {
  console.log('=== Login Tracker Demo ===\n');
  
  // Test 1: Basic failure and lock scenario
  console.log('Test 1: Three failed attempts');
  const tracker1 = createLoginTracker({ username: 'sam', password: 'abc123' });
  console.log(tracker1('wrong'));   // Attempt 1: Login failed
  console.log(tracker1('wrong'));   // Attempt 2: Login failed
  console.log(tracker1('wrong'));   // Attempt 3: Login failed
  console.log(tracker1('abc123'));  // Account locked due to too many failed login attempts
  
  console.log('\nTest 2: Successful login before lock');
  const tracker2 = createLoginTracker({ username: 'alice', password: 's3cret' });
  console.log(tracker2('wrong'));   // Attempt 1: Login failed
  console.log(tracker2('s3cret'));  // Login successful
  
  console.log('\nTest 3: Immediate success');
  const tracker3 = createLoginTracker({ username: 'bob', password: 'pass' });
  console.log(tracker3('pass'));    // Login successful
  
  console.log('\n=== All tests complete ===');
}




