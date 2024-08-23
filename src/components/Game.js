import Phaser from 'phaser';
import React, { useEffect, useImperativeHandle, forwardRef, useRef } from 'react';

const Game = forwardRef((props, ref) => {
  const gameRef = useRef(null);
  const buttonPositions = useRef({
    'up1': { x: 300, y: 50 },
    'up2': { x: 400, y: 50 },
    'down1': { x: 300, y: 350 },
    'down2': { x: 400, y: 350 },
    'left1': { x: 50, y: 200 },
    'left2': { x: 50, y: 250 },
    'right1': { x: 550, y: 200 },
    'right2': { x: 550, y: 250 }
  });

  useImperativeHandle(ref, () => ({
    moveBall(direction) {
      if (!gameRef.current) return;

      const ball = gameRef.current;
      const buttonPos = buttonPositions.current[direction];

      if (buttonPos) {
        // Calculate the direction to the button position
        const dx = buttonPos.x - ball.x;
        const dy = buttonPos.y - ball.y;
        const angle = Math.atan2(dy, dx);
        const speed = 300; // Adjust speed as needed

        // Set velocity to move towards the button
        ball.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle));
      }
    },
  }));

  useEffect(() => {
    const config = {
      type: Phaser.CANVAS,
      width: 600,
      height: 400,
      parent: 'phaser-game',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('sky', 'assets/cloudWithSea.png');
      this.load.image('ball', 'assets/tennis-ball.png');
    }

    function create() {
      this.add.image(300, 200, 'sky');
      const ball = this.physics.add.image(300, 200, 'ball')
        .setCollideWorldBounds(true)
        .setBounce(1, 1);
      ball.setDisplaySize(50, 50);
      ball.setVelocity(300, 300); // Initial velocity

      gameRef.current = ball;

      ball.body.onWorldBounds = true;
      ball.body.world.on('worldbounds', (body) => {
        if (body.gameObject === ball) {
          // After hitting a wall, change the ball's velocity randomly
          ball.setVelocity(
            Phaser.Math.Between(-300, 300),
            Phaser.Math.Between(-300, 300)
          );
        }
      });
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" style={{ width: '100%', height: '100%' }}></div>;
});

export default Game;
