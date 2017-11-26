"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const fs_1 = require("../../castable/fs");
const SAMPLE_FILES_DIR = Path.join(__dirname, '../../../test/sample-files');
const FILE_BASE_NAME = 'file';
const TEXT_FILE_NAME = 'file.txt';
const JSON_FILE_NAME = 'file.json';
const NON_EXISTENT_NAME = 'guess-what';
const FILE_BASE_PATH = Path.join(SAMPLE_FILES_DIR, FILE_BASE_NAME);
const TEXT_FILE_PATH = Path.join(SAMPLE_FILES_DIR, TEXT_FILE_NAME);
const JSON_FILE_PATH = Path.join(SAMPLE_FILES_DIR, JSON_FILE_NAME);
const NON_EXISTENT_PATH = Path.join(SAMPLE_FILES_DIR, NON_EXISTENT_NAME);
const context = {
    name: 'test',
    commands: ['clime'],
    cwd: SAMPLE_FILES_DIR,
    validators: [],
    default: false,
};
describe('Castable object `File`', () => {
    let textFile = fs_1.File.cast(TEXT_FILE_PATH, context);
    let jsonFile = fs_1.File.cast(JSON_FILE_PATH, context);
    it('should assert existence', () => __awaiter(this, void 0, void 0, function* () {
        yield textFile.assert();
        yield textFile.assert(true);
        yield jsonFile.assert(false).should.be.rejectedWith('already exists');
        yield fs_1.File.cast(NON_EXISTENT_NAME, context).assert(false);
        yield fs_1.File.cast(NON_EXISTENT_PATH, context).assert().should.be.rejectedWith('does not exist');
        yield fs_1.File.cast(SAMPLE_FILES_DIR, context).assert().should.be.rejectedWith('expected to be a file');
    }));
    it('should test existence', () => __awaiter(this, void 0, void 0, function* () {
        yield textFile.exists().should.eventually.be.true;
        yield fs_1.File
            .cast(FILE_BASE_PATH, context)
            .exists(['.txt'])
            .should.eventually.equal(TEXT_FILE_PATH);
        yield fs_1.File
            .cast(FILE_BASE_PATH, context)
            .exists(['.js', '.txt'])
            .should.eventually.equal(TEXT_FILE_PATH);
        yield fs_1.File
            .cast(FILE_BASE_PATH, context)
            .exists(['.js'])
            .should.eventually.be.undefined;
        yield fs_1.File.cast(NON_EXISTENT_PATH, context).exists().should.eventually.be.false;
        yield fs_1.File.cast(SAMPLE_FILES_DIR, context).exists().should.eventually.be.false;
    }));
    it('should read buffer', () => __awaiter(this, void 0, void 0, function* () {
        let buffer = yield textFile.buffer();
        buffer.should.be.instanceOf(Buffer);
        buffer.toString('utf-8').should.equal('content\n');
    }));
    it('should read text', () => __awaiter(this, void 0, void 0, function* () {
        (yield textFile.text('ascii')).should.equal('content\n');
        (yield textFile.text()).should.equal('content\n');
    }));
    it('should read json', () => __awaiter(this, void 0, void 0, function* () {
        (yield jsonFile.json()).should.deep.equal({ key: 'value' });
    }));
    it('should require', () => {
        jsonFile.require().should.deep.equal({ key: 'value' });
    });
});
describe('Castable object `Directory`', () => {
    it('should assert existence', () => __awaiter(this, void 0, void 0, function* () {
        yield fs_1.Directory.cast(SAMPLE_FILES_DIR, context).assert();
        yield fs_1.Directory.cast('.', context).assert(true);
        yield fs_1.Directory.cast(NON_EXISTENT_NAME, context).assert(false);
        yield fs_1.Directory.cast(SAMPLE_FILES_DIR, context).assert(false).should.be.rejectedWith('already exists');
        yield fs_1.Directory.cast(NON_EXISTENT_PATH, context).assert().should.be.rejectedWith('does not exist');
        yield fs_1.Directory.cast(TEXT_FILE_NAME, context).assert().should.be.rejectedWith('expected to be a directory');
    }));
    it('should test existence', () => __awaiter(this, void 0, void 0, function* () {
        yield fs_1.Directory.cast(SAMPLE_FILES_DIR, context).exists().should.eventually.be.true;
        yield fs_1.Directory.cast(NON_EXISTENT_PATH, context).exists().should.eventually.be.false;
        yield fs_1.Directory.cast(TEXT_FILE_NAME, context).exists().should.eventually.be.false;
    }));
});
//# sourceMappingURL=castable-fs-test.js.map