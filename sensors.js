//current sensor
const current_sensor = {
  end_device_ids: {
    device_id: 'pm1',
    application_ids: { application_id: 'power-monitor' },
    dev_eui: 'A840413C3B5BBCD2',
    join_eui: 'A840410000000101',
    dev_addr: '27FD75C2'
  },
  correlation_ids: [ 'gs:uplink:01JPW5HPVTFY95H517X2442G92' ],
  received_at: '2025-03-21T10:56:26.182804937Z',
  uplink_message: {
    session_key_id: 'AZVx8DFUMycEWe+5+m7qUw==',
    f_port: 2,
    f_cnt: 14068,
    frm_payload: 'DhYFUgVYAAEAAQA=',
    decoded_payload: {
      BatV: 3.606,
      Cur1H_status: 'False',
      Cur1L_status: 'False',
      Cur2H_status: 'False',
      Cur2L_status: 'False',
      Cur3H_status: 'False',
      Cur3L_status: 'False',
      Cur4H_status: 'False',
      Cur4L_status: 'False',
      Current1_A: 13.62,
      Current2_A: 13.68,
      Current3_A: 0.01,
      Current4_A: 0.01,
      EXTI_Level: 'LOW',
      EXTI_Trigger: 'FALSE'
    },
    rx_metadata: [
      {
        "gateway_ids": {
          "gateway_id": "eui-a84041ffff27dce0",
          "eui": "A84041FFFF27DCE0"
        },
        "time": "2025-05-07T15:22:00.811203Z",
        "timestamp": 1502598525,
        "rssi": -109,
        "channel_rssi": -109,
        "snr": 9,
        "frequency_offset": "-978",
        "uplink_token": "CiIKIAoUZXVpLWE4NDA0MWZmZmYyN2RjZTASCKhAQf//J9zgEP2qv8wFGgwImPXtwAYQo9bL0QMgyODnzt3dGQ==",
        "channel_index": 7,
        "received_at": "2025-05-07T15:22:00.817465623Z"
      }
    ],
    settings: {
      data_rate: [],
      frequency: '905100000',
      timestamp: 177306760,
      time: '2025-03-21T10:56:25.949040Z'
    },
    received_at: '2025-03-21T10:56:25.979857150Z',
    consumed_airtime: '0.061696s',
    network_ids: {
      net_id: '000013',
      ns_id: 'EC656E0000102F3E',
      tenant_id: 'vipnet',
      cluster_id: 'nam1',
      cluster_address: 'nam1.cloud.thethings.industries',
      tenant_address: 'vipnet.nam1.cloud.thethings.industries'
    },
    last_battery_percentage: {
      f_cnt: 13963,
      value: 100,
      received_at: '2025-03-21T09:11:27.115070373Z'
    }
  }
};
//Door sensor
/*const door_sensor = {
  end_device_ids: {
    device_id: 'commercialoutdoor',
    application_ids: { application_id: 'vip-outdoor-metrics' },
    dev_eui: 'A840413C8188874A',
    join_eui: 'A840410000000101',
    dev_addr: '27FD75C6'
  },
  correlation_ids: [ 'gs:uplink:01JQ0H1GV2T6EWNPCV68648B3N' ],
  received_at: '2025-03-23T03:34:16.372164030Z',
  uplink_normalized: {
    session_key_id: 'AZRWlGUgJE/MzHchIEK7AA==',
    f_port: 2,
    f_cnt: 5070,
    frm_payload: 'D65n34E/AACQAUE=',
    normalized_payload: { action: [], air: [], battery: 4.014 },
    rx_metadata: [],
    settings: {
      data_rate: [],
      frequency: '905100000',
      timestamp: 2409618326,
      time: '2025-03-23T03:34:16.139541Z'
    },
    received_at: '2025-03-23T03:34:16.163638370Z',
    consumed_airtime: '0.061696s',
    network_ids: {
      net_id: '000013',
      ns_id: 'EC656E0000102F3E',
      tenant_id: 'vipnet',
      cluster_id: 'nam1',
      cluster_address: 'nam1.cloud.thethings.industries',
      tenant_address: 'vipnet.nam1.cloud.thethings.industries'
    }
  }
};*/


const door_sensor = {
  end_device_ids: {
    device_id: 'b2-mdeast2',
    application_ids: { application_id: 'cc-door-monitor-central' },
    dev_eui: 'A8404105C1882A85',
    join_eui: 'A840410000000101',
    dev_addr: '27FD75C6'
  },
  correlation_ids: [ 'gs:uplink:01JTJ5PTBG7N8NVHPDA9QRT8HJ' ],
  received_at: '2025-05-06T06:49:36.579269203Z',
  uplink_message: {
    session_key_id: 'AZLpIaMKBrb02WkFptPeLg==',
    f_port: 5,
    f_cnt: 2619,
    frm_payload: 'CgEQAgAOXg==',
    decoded_payload: {
      BAT: 3.678,
      FIRMWARE_VERSION: '1.1.0',
      FREQUENCY_BAND: 'US915',
      SENSOR_MODEL: 'LDS03A',
      SUB_BAND: 0
    },
    rx_metadata: [
      {
        "gateway_ids": {
          "gateway_id": "eui-a84041ffff27dce0",
          "eui": "A84041FFFF27DCE0"
        },
        "time": "2025-05-07T15:22:00.811203Z",
        "timestamp": 1502598525,
        "rssi": -109,
        "channel_rssi": -109,
        "snr": 9,
        "frequency_offset": "-978",
        "uplink_token": "CiIKIAoUZXVpLWE4NDA0MWZmZmYyN2RjZTASCKhAQf//J9zgEP2qv8wFGgwImPXtwAYQo9bL0QMgyODnzt3dGQ==",
        "channel_index": 7,
        "received_at": "2025-05-07T15:22:00.817465623Z"
      }
    ],
    settings: {
      data_rate: [Object],
      frequency: '903900000',
      timestamp: 231457101,
      time: '2025-05-06T06:49:36.348461Z'
    },
    received_at: '2025-05-06T06:49:36.369469053Z',
    consumed_airtime: '0.056576s',
    version_ids: {
      brand_id: 'dragino',
      model_id: 'lds03a',
      hardware_version: '_unknown_hw_version_',
      firmware_version: '1.0',
      band_id: 'US_902_928'
    },
    network_ids: {
      net_id: '000013',
      ns_id: 'EC656E0000102F3E',
      tenant_id: 'vipnet',
      cluster_id: 'nam1',
      cluster_address: 'nam1.cloud.thethings.industries',
      tenant_address: 'vipnet.nam1.cloud.thethings.industries'
    },
    last_battery_percentage: {
      f_cnt: 2612,
      value: 100,
      received_at: '2025-05-05T18:49:37.753652777Z'
    }
  }
};

//LHT
const environmental_sensor = {
  "name": "as.up.data.forward",
  "time": "2025-05-07T15:22:01.192487593Z",
  "identifiers": [
    {
      "device_ids": {
        "device_id": "fdl-sensor1-mainroom",
        "application_ids": {
          "application_id": "indoor-lht-metrics-app"
        },
        "dev_eui": "A840417F9189F378",
        "join_eui": "A840410000000100",
        "dev_addr": "27FD75CE"
      }
    }
  ],
  "data": {
    "@type": "type.googleapis.com/ttn.lorawan.v3.ApplicationUp",
    "end_device_ids": {
      "device_id": "fdl-sensor1-mainroom",
      "application_ids": {
        "application_id": "indoor-lht-metrics-app"
      },
      "dev_eui": "A840417F9189F378",
      "join_eui": "A840410000000100",
      "dev_addr": "27FD75CE"
    },
    "correlation_ids": [
      "gs:uplink:01JTNNDSCGHGPV0EAYGWVYMSYQ"
    ],
    "received_at": "2025-05-07T15:22:01.187679495Z",
    "uplink_message": {
      "session_key_id": "AZW0ImI+QrHD3kUvJ0rEQg==",
      "f_port": 2,
      "f_cnt": 3459,
      "frm_payload": "zAgHpgOFDgAAAAM=",
      "decoded_payload": {
        "BatV": 3.08,
        "Bat_status": 3,
        "Hum_SHT": 90.1,
        "TempC_SHT": 19.58
      },
      "normalized_payload": [
        {
          "air": {
            "location": "indoor",
            "relativeHumidity": 90.1,
            "temperature": 19.58
          }
        }
      ],
      "rx_metadata": [
        {
          "gateway_ids": {
            "gateway_id": "eui-a84041ffff27dce0",
            "eui": "A84041FFFF27DCE0"
          },
          "time": "2025-05-07T15:22:00.811203Z",
          "timestamp": 1502598525,
          "rssi": -109,
          "channel_rssi": -109,
          "snr": 9,
          "frequency_offset": "-978",
          "uplink_token": "CiIKIAoUZXVpLWE4NDA0MWZmZmYyN2RjZTASCKhAQf//J9zgEP2qv8wFGgwImPXtwAYQo9bL0QMgyODnzt3dGQ==",
          "channel_index": 7,
          "received_at": "2025-05-07T15:22:00.817465623Z"
        }
      ],
      "settings": {
        "data_rate": {
          "lora": {
            "bandwidth": 125000,
            "spreading_factor": 7,
            "coding_rate": "4/5"
          }
        },
        "frequency": "905300000",
        "timestamp": 1502598525,
        "time": "2025-05-07T15:22:00.811203Z"
      },
      "received_at": "2025-05-07T15:22:00.977025550Z",
      "consumed_airtime": "0.061696s",
      "version_ids": {
        "brand_id": "dragino",
        "model_id": "lht65",
        "hardware_version": "_unknown_hw_version_",
        "firmware_version": "1.8",
        "band_id": "US_902_928"
      },
      "network_ids": {
        "net_id": "000013",
        "ns_id": "EC656E0000102F3E",
        "tenant_id": "vipnet",
        "cluster_id": "nam1",
        "cluster_address": "nam1.cloud.thethings.industries",
        "tenant_address": "vipnet.nam1.cloud.thethings.industries"
      },
      "last_battery_percentage": {
        "f_cnt": 3413,
        "value": 100,
        "received_at": "2025-05-07T00:02:14.258647589Z"
      }
    }
  },
  "correlation_ids": [
    "gs:uplink:01JTNNDSCGHGPV0EAYGWVYMSYQ"
  ],
  "origin": "ip-10-22-5-28.us-west-1.compute.internal",
  "context": {
    "tenant-id": "CgZ2aXBuZXQ="
  },
  "visibility": {
    "rights": [
      "RIGHT_APPLICATION_TRAFFIC_READ"
    ]
  },
  "unique_id": "01JTNNDSK8J77ZBR7SH59B6WXE"
};


//INSERT INTO public.door_devices (eui, id, open_status, update_at) VALUES ('eui-a840412891882a99', 'b2-md2east',   'OPEN', '2025-04-22 23:28:56.810779+00');

const getSystemParams = function (uplink_message){
  let systemParams = {};
  if(uplink_message){
    const firmware_version = uplink_message.decoded_payload.Firmware_Version ||
        uplink_message.decoded_payload.FIRMWARE_VERSION ||
        (uplink_message.version_ids)? uplink_message.version_ids.firmware_version: undefined;
    if(firmware_version){
      systemParams.firmware_version = firmware_version;
    }
    const bat_mv = uplink_message.decoded_payload.Bat_mV ||
            (uplink_message.decoded_payload.BAT || uplink_message.decoded_payload.BatV) * 1000;
    if(bat_mv){
      systemParams.bat_mv = bat_mv;
    }
    const frequency_band = uplink_message.decoded_payload.FREQUENCY_BAND ||
        (uplink_message.version_ids)? uplink_message.version_ids.band_id: undefined;
    if(frequency_band){
      systemParams.frequency_band = frequency_band;
    }
    const sub_band = uplink_message.decoded_payload.Sub_Band || uplink_message.decoded_payload.SUB_BAND;
    if(sub_band !== undefined){
      systemParams.sub_band = sub_band.toString();
    }
    const sensor_model = (uplink_message.version_ids)? uplink_message.version_ids.model_id: undefined;
    if(sensor_model){
      systemParams.sensor_model = sensor_model;
    }
    const brand = (uplink_message.version_ids)? uplink_message.version_ids.brand_id: undefined;
    if(brand){
      systemParams.brand = brand;
    }
    const gateway = (uplink_message.rx_metadata[0].gateway_ids.eui)? uplink_message.rx_metadata[0].gateway_ids.eui: undefined;
    if(gateway){
      systemParams.gateway = 'eui-'+gateway.toLowerCase();
    }
  }
  return systemParams;
}

/*console.log('Environmental sensor: ', getSystemParams(environmental_sensor.data.uplink_message));
console.log('Door Sensor: ', getSystemParams(door_sensor.uplink_message));
console.log('Current Sensor: ', getSystemParams(current_sensor.uplink_message));*/

export {getSystemParams};

