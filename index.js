import {
	existsSync,
	readFileSync,
	writeFileSync,
	readdirSync,
} from "fs";
import {
	execSync,
	spawn
} from "child_process";

const encoding = "utf-8";

export function truncate(line, delim) {
	return line.substring(
		0,
		Math.max(
			0,
			line.lastIndexOf(delim)
		) || undefined
	).trim();
}

export function parent_dir(path) {
	if (path.endsWith('/'))
		path = path.substring(0, path.length - 1);
	return path.split('/').slice(0, -1).join('/');
}

export function exists(inode) {
	return existsSync(inode);
}

export function exec(cmd) {
	return execSync(cmd);
}

export function run(cmd, stdout, callback, stderr) {
	const proc = spawn(cmd);
	stdout && proc.stdout.on('data', stdout);
	stderr && proc.stderr.on('data', stderr);
	callback && proc.on('close', callback);
	return proc;
}

export function mkdir(path) {
	return exec(`mkdir -p ${path}`);
}

export function prompt(msg, def) {
	// TODO: use blessed.js I guess
}

export function map(source, target) {
	mkdir(parent_dir(target));
	return !existsSync(target) ?
		run("ln", "-s", source, target) : `MAP EXISTS: ${source} -> ${target}`;
}

export function read(file) {
	return readFileSync(file, {encoding});
}

export function write(file, contents) {
	return writeFileSync(file, contents);
}

export function read_dir(path) {
	return readdirSync(path);
}

export function touch(path) {
	mkdir(parent_dir(path));
	return exec(`touch ${path}`);
}

export function readlines(file, _comment = '#') {
	return read(file)
			.split(/\r?\n/)
			.map(line => line.trim())
			.filter(line => line)
			.filter(line => !line.startsWith(_comment))
			.map(line => truncate(line, _comment))
}