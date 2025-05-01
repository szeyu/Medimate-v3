import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// Update constants to use full screen dimensions
const ICON_SIZE = 40;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height; // Use full screen height

const AnimatedBackground = ({ children }) => {
  // Define icons with initial positions spread across the screen
  const [icons] = useState([
    { name: "heartbeat", position: { x: 30, y: 40 }, velocity: { x: 0.3, y: 0.2 } },
    { name: "pills", position: { x: 80, y: 120 }, velocity: { x: -0.2, y: 0.3 } },
    { name: "notes-medical", position: { x: SCREEN_WIDTH - 80, y: 60 }, velocity: { x: -0.3, y: -0.2 } },
    { name: "hospital", position: { x: SCREEN_WIDTH - 110, y: 180 }, velocity: { x: 0.2, y: -0.3 } },
    { name: "stethoscope", position: { x: 50, y: 220 }, velocity: { x: 0.25, y: -0.15 } },
    { name: "prescription-bottle-alt", position: { x: 200, y: 150 }, velocity: { x: -0.15, y: 0.25 } },
    { name: "biking", position: { x: 240, y: 100 }, velocity: { x: -0.2, y: -0.2 } },
    { name: "flask", position: { x: 170, y: 30 }, velocity: { x: 0.1, y: 0.3 } },
    // Add more icons distributed across the screen
    { name: "ambulance", position: { x: 100, y: SCREEN_HEIGHT - 200 }, velocity: { x: 0.2, y: -0.2 } },
    { name: "briefcase-medical", position: { x: SCREEN_WIDTH - 150, y: SCREEN_HEIGHT - 300 }, velocity: { x: -0.15, y: -0.25 } },
    { name: "heartbeat", position: { x: SCREEN_WIDTH/2, y: SCREEN_HEIGHT/2 }, velocity: { x: 0.25, y: 0.2 } },
    { name: "medkit", position: { x: SCREEN_WIDTH - 100, y: SCREEN_HEIGHT - 150 }, velocity: { x: -0.2, y: 0.15 } },
    
    
  ]);

  // Create animated values for each icon
  const animatedPositions = useRef(icons.map(icon => ({
    x: new Animated.Value(icon.position.x),
    y: new Animated.Value(icon.position.y)
  }))).current;

  // Animation loop
  useEffect(() => {
    let animationFrameId;
    let lastTime = Date.now();
    
    const positions = icons.map(icon => ({ ...icon.position }));
    const velocities = icons.map(icon => ({ ...icon.velocity }));
    
    // Slow down the animation slightly for smoother movement
    const speedFactor = 0.5;
    
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = Math.min(currentTime - lastTime, 30); // Cap delta time to prevent large jumps
      lastTime = currentTime;
      
      // Update positions based on velocities
      for (let i = 0; i < icons.length; i++) {
        positions[i].x += velocities[i].x * deltaTime * speedFactor;
        positions[i].y += velocities[i].y * deltaTime * speedFactor;
        
        // Boundary collision detection (screen edges)
        if (positions[i].x < 0 || positions[i].x > SCREEN_WIDTH - ICON_SIZE) {
          velocities[i].x = -velocities[i].x;
          positions[i].x = Math.max(0, Math.min(positions[i].x, SCREEN_WIDTH - ICON_SIZE));
        }
        
        if (positions[i].y < 0 || positions[i].y > SCREEN_HEIGHT - ICON_SIZE) {
          velocities[i].y = -velocities[i].y;
          positions[i].y = Math.max(0, Math.min(positions[i].y, SCREEN_HEIGHT - ICON_SIZE));
        }
        
        // Icon collision detection
        for (let j = i + 1; j < icons.length; j++) {
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < ICON_SIZE) {
            // Calculate collision response
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            
            // Swap velocities for realistic bounce
            const vx1 = velocities[i].x * cos + velocities[i].y * sin;
            const vy1 = velocities[i].y * cos - velocities[i].x * sin;
            const vx2 = velocities[j].x * cos + velocities[j].y * sin;
            const vy2 = velocities[j].y * cos - velocities[j].x * sin;
            
            velocities[i].x = vx2 * cos - vy1 * sin;
            velocities[i].y = vy1 * cos + vx2 * sin;
            velocities[j].x = vx1 * cos - vy2 * sin;
            velocities[j].y = vy2 * cos + vx1 * sin;
            
            // Move icons apart to prevent sticking
            const overlap = ICON_SIZE - distance;
            positions[i].x += overlap * cos * 0.5;
            positions[i].y += overlap * sin * 0.5;
            positions[j].x -= overlap * cos * 0.5;
            positions[j].y -= overlap * sin * 0.5;
          }
        }
        
        // Update animated values
        animatedPositions[i].x.setValue(positions[i].x);
        animatedPositions[i].y.setValue(positions[i].y);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <View style={styles.container}>
      {icons.map((icon, index) => (
        <Animated.View
          key={index}
          style={[
            styles.iconBackground,
            {
              transform: [
                { translateX: animatedPositions[index].x },
                { translateY: animatedPositions[index].y },
                { rotate: '10deg' }
              ],
            }
          ]}
        >
          <FontAwesome5 name={icon.name} size={ICON_SIZE} color="rgba(8, 3, 3, 0.15)" />
        </Animated.View>
      ))}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
    backgroundColor: 'rgba(32, 190, 124, 0.1)',
  },
  iconBackground: {
    position: 'absolute',
    zIndex: 1,
    opacity: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure content is above animations
},
});

export default AnimatedBackground;