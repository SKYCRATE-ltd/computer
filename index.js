import {
	existsSync,
	readFileSync,
	writeFileSync,
	readdirSync,
	lstatSync
} from "fs";
import {
	execSync,
	spawn
} from "child_process";
import {
	resolve
} from "path";

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

export function resolve_dir(...paths) {
	return resolve(...paths);
}

export function exists(inode) {
	return existsSync(inode);
}

export function exec(cmd) {
	return execSync(cmd, {encoding}).trim();
}

export function cwd() {
	return exec('pwd');
}

export function is_sudo() {
	return exec(`whoami`) === 'root';
}

export function is_installed(cmd) {
	try {
		exec(
		`command -v ${cmd} >/dev/null 2>&1 || \
			hash ${cmd} 2>/dev/null || \
			type ${cmd} >/dev/null 2>&1 || \
			return 1`);
	} catch (e) {
		return false;
	}
	return true;
}

export function is_directory(path) {
	return lstatSync(path).isDirectory();
}

export function is_file(path) {
	return lstatSync(path).isFile();
}

export function uuid() {
	return exec('uuidgen');
}

export function run(cmd, stdout, callback, stderr) {
	const proc = spawn(cmd);
	stdout && proc.stdout.on('data', stdout);
	stderr && proc.stderr.on('data', stderr);
	callback && proc.on('close', callback);
	return proc;
}

export function mkdir(path) {
	return exec(`mkdir -p "${path}"`);
}

export function map(source, target) {
	mkdir(parent_dir(target));
	return exec(`ln -fs "${source}" "${target}"`);
}

export function copy(source, target) {
	mkdir(parent_dir(target));
	return exec(`cp -f "${source}" "${target}"`);
}

export function read(file) {
	return readFileSync(file, {encoding});
}

export function write(file, contents) {
	touch(file);
	return writeFileSync(file, contents, {encoding});
}

export function read_dir(path) {
	return readdirSync(path);
}

export function touch(path) {
	mkdir(parent_dir(path));
	return exec(`touch "${path}"`);
}

export function del(path) {
	return exec(`rm -rf "${path}"`);
}

export function readlines(file, _comment = '#') {
	return read(file)
			.split(/\r?\n/)
			.map(line => line.trim())
			.filter(line => line)
			.filter(line => !line.startsWith(_comment))
			.map(line => truncate(line, _comment))
}

export function prompt(msg, def) {
	// TODO: use blessed.js I guess
}