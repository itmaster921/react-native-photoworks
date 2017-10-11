import React from 'react';
import { AsyncStorage } from 'react-native'

export default class Storage {
	get = async function( key ) {
		try {
			const value = await AsyncStorage.getItem(key);			
			if (value !== null)
				return value;
		} catch (error) {
			console.log( error );
		}
		return null;
	}
	save = async function( key , value ) {
		try {
			await AsyncStorage.setItem( key , value );
		} catch ( error ){
			console.log( error );
		}
	}
}