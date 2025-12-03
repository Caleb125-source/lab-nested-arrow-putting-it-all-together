/*
module.exports = {
  ...(typeof createLoginTracker !== 'undefined' && { createLoginTracker })
}; 

 * JavaScript Functions - Secure Login Tracker
 * Illustrates nested functions, closures, and arrow functions
 */

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
      return {
        success: false,
        message: 'Account locked',
        attemptsLeft: 0,
        locked: true
      };
    }
    
    // Check if password matches
    if (passwordAttempt === storedPassword) {
      return {
        success: true,
        message: 'Login successful',
        attemptsLeft: MAX_ATTEMPTS - failedAttempts,
        locked: false
      };
    }
    
    // Failed attempt - increment counter
    failedAttempts++;
    
    // Check if account should be locked
    if (failedAttempts >= MAX_ATTEMPTS) {
      isLocked = true;
      return {
        success: false,
        message: 'Account locked',
        attemptsLeft: 0,
        locked: true
      };
    }
    
    // Failed but still have attempts left
    const attemptsRemaining = MAX_ATTEMPTS - failedAttempts;
    return {
      success: false,
      message: `Incorrect password — ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} left`,
      attemptsLeft: attemptsRemaining,
      locked: false
    };
  };
  
  return loginAttempt;
}

module.exports = createLoginTracker;

// Demo/test code (runs only when executed directly)
if (require.main === module) {
  console.log('=== Login Tracker Demo ===\n');
  
  // Test 1: Basic failure and lock scenario
  console.log('Test 1: Three failed attempts');
  const tracker1 = createLoginTracker({ username: 'sam', password: 'abc123' });
  console.log(tracker1('wrong'));   // Attempt 1
  console.log(tracker1('wrong'));   // Attempt 2
  console.log(tracker1('wrong'));   // Attempt 3 - locks
  console.log(tracker1('abc123'));  // Locked - even correct password fails
  
  console.log('\nTest 2: Successful login before lock');
  const tracker2 = createLoginTracker({ username: 'alice', password: 's3cret' });
  console.log(tracker2('wrong'));   // Attempt 1
  console.log(tracker2('s3cret'));  // Success
  
  console.log('\nTest 3: Immediate success');
  const tracker3 = createLoginTracker({ username: 'bob', password: 'pass' });
  console.log(tracker3('pass'));    // Success on first try
  
  console.log('\n=== All tests complete ===');
}


