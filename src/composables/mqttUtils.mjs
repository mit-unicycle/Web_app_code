import mqtt from "precompiled-mqtt";

/**
 * Class that contains MQTT related logic
 * Written by: David Farah
 * Email: david.farah@epfl.ch
 */
export default class MqttUtils {
    #mqttClientPromise = null
    #subscribedTopics = new Set()
    #previouslySubscribedTopics = new Set()

    /**
     * Constructor of the class
     * @param mqttClientPromise mqttClient promise
     * @param messageCallback method to call back when an MQTT message is received
     */
    constructor(mqttClientPromise, messageCallback) {
        if (!mqttClientPromise) throw new Error("No mqttClientPromise was provided")
        else this.#mqttClientPromise = mqttClientPromise

        this.on("message", messageCallback)
    }

    /**
     * Method that adds a listener to certain event
     * @param eventName Name of the event as mentioned in the mqtt docs
     * @param callbackFunction Function to callback on event
     */
    on(eventName, callbackFunction) {
        this.#mqttClientPromise.then((client) => {
            client.on(eventName, callbackFunction)
        })
    }

    /**
     * Returns true if the client is connected, false otherwise
     * @returns {boolean}
     */
    connected() {
        return this.#mqttClientPromise.then((client) => {client.connected})
    }

    /**
     * Unsubscribe from all the topics in #subscribedTopics
     */
    unsubscribeAll() {
        this.#previouslySubscribedTopics = new Set(this.#subscribedTopics)
        this.unsubscribeFrom(Array.from(this.#subscribedTopics))
    }

    /**
     * Subscribe to all the topics in #previouslySubscribedTopics
     */
    resubscribeAll() {
        this.subscribeTo(Array.from(this.#previouslySubscribedTopics))
    }

    /**
     * Subscribe to topics
     * @param topics Array of topics to subscribe to (not ref)
     */
    subscribeTo(topics){
        //if(topics.length) { console.log("subscribed to " + topics)}
        topics.forEach(topic => this.#subscribedTopics.add(topic))
        this.#mqttClientPromise.then((client) => {client.subscribe(topics)})
    }

    /**
     * Subscribe from topics
     * @param topics Array of topics to subscribe from (not ref)
     */
    unsubscribeFrom(topics){
        //if(topics.length) console.log("unsubscribed from " + topics)
        topics.forEach(topic => this.#subscribedTopics.delete(topic))
        this.#mqttClientPromise.then((client) => { client.unsubscribe(topics) })
    }

    /**
     * Send a message over mqtt on the given topic
     * @param topic
     * @param message
     */
    send(topic, message) {
        this.#mqttClientPromise.then((client) => {
            client.publish(topic, message)
        })
    }

//---------------------------------------------STATIC METHODS-----------------------------------------------
    /**
     * Asynchronous method that returns a promise, from which we can obtain the mqtt client if resolved.
     * We use the MQTT.js library to communicate with broker through websockets (Not TCP - that's why I used precompiled-mqtt)
     * @returns client
     */
    static async getMqttClient(){
        const clientId = "ID_"
        const host = 'mqtt host'

        const options = {
            keepalive: 60,
            clientId: clientId + Math.random().toString(16).substring(2, 10),
            username: 'mit',
            password: 'mit',
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            will: {
                topic: 'WillMsg',
                payload: 'Connection Closed abnormally..!',
                qos: 0,
                retain: false
            },
        }

        const client = await this.#getClient(host, options)

        client.on('error', (err) => {
            console.log('Connection error: ', err)
        })
        client.on('reconnect', () => {
            console.log('Reconnecting...')
        })
        client.on('connect', () => {
            console.log(`Connected to broker: ${host}`)
        })

        client.on('offline', function () {
            console.log('Client Offline')
        })

        return client;
    }


    /**
     * Return Client as a promise (for using async and await) so that the code waits for a response
     * @param host broker ip address and port
     * @param options options applied to client
     * @returns {Promise<mqtt.MqttClient | String>}
     */
    static #getClient(host, options){
        return new Promise((resolve, reject) => {
            const client = mqtt.connect(host, options)

            if(client){resolve(client)}
            else reject("Client connection couldn't be established ")
        })
    }
}