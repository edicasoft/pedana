import sys
import glob
import serial
import time

def find_posturometer_port(handshake_char):
	while 1:
		ports = None
		if sys.platform.startswith('win'):
			ports = ['COM%s' % (i + 1) for i in range(256)]
		elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
			# this excludes your current terminal "/dev/tty"
			ports = glob.glob('/dev/tty[A-Za-z]*')
		elif sys.platform.startswith('darwin'):
			ports = glob.glob('/dev/tty.u*')
		else:
			raise EnvironmentError('Unsupported platform')
		if not ports:
			print('waiting for a device...')
			time.sleep(1)
			continue
		for port in ports:
			try:
				print('Finding Posturometer ' + handshake_char + ' on ', port)
				s = serial.Serial(port, baudrate=115200, timeout=0.1)
				received_bytes = s.read(3)
				print(hex(int.from_bytes(received_bytes,byteorder='big')))
				if received_bytes == (bytes(handshake_char, 'utf-8') + b'\x0d\x0a'):
					print('Posturometer ' + handshake_char + ' found on ', port)
					return port
				else:
					print('Posturometer ' + handshake_char + ' not found on ', port)
				s.close()
			except (OSError, serial.SerialException):
				pass

if __name__ == '__main__':
	stop_char = 's'
	# left or right?
	hs_char = input('(l)eft or (r)ight? [l]:')
	hs_char = 'l' if not hs_char else hs_char

	port = serial.Serial(find_posturometer_port(hs_char), baudrate=115200, timeout=2.0)

	port.write((hs_char).encode())
	port.write((stop_char).encode())
	port.readline()   #only to flush any remaining data
	time.sleep(.1)
	
	while 1:
		bytes = port.readline()
		# print(bytes)
		try:
			P1 = int(bytes[:5]) - 100
			P2 = int(bytes[6:11]) - 100
			P3 = int(bytes[12:]) - 100
			print('Total: ', f'{(P1+P2+P3):<6} P1: {P1:<6} P2: {P2:<6} P3: {P3:<6}')
		except ValueError:
			pass

	# right
	hs_char = 'r'
	port = serial.Serial(find_posturometer_port(hs_char), baudrate=115200, timeout=2.0)
	port.write((hs_char).encode())
	port.write((stop_char).encode())
	port.readline()   #only to flush any remaining data
	time.sleep(.1)
	
	while 1:
		bytes = port.readline()
		# print(bytes)
		try:
			A = int(bytes[:5]) - 100
			B = int(bytes[6:11]) - 100
			C = int(bytes[12:]) - 100
			# print('Right: ', RA, ', RB: ', RB, ', RC: ', RC)
			print('Left total: ', (A+B+C), '; A: ', A, ', B: ', B, ', C: ', C)
		except ValueError:
			pass
