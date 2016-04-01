/**
 * Clock timer
 *
 * Todo: multiple instances when needed. They can cause issues with eachother
 *
 */
define([
       "PhysicFactory"
       ], function ( PhysicFactory ){

	var physics = new PhysicFactory();

    return physics;

});